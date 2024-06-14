import { Prisma, PrismaClient, TeamSelection } from '@prisma/client';
import userService from './userService.js';
import gameService from './gameService.js';

const prisma = new PrismaClient();

const errors = {
    'unknown': { statusCode: 500, message: 'Internal Server Error' },
    'noBalance': { statusCode: 402, message: 'Insufficient Funds' },
    'gameNotFound': { statusCode: 404, message: 'Game Not Found' },
    'betsClosed': { statusCode: 400, message: 'Bets Is Closed' },
    'userNotFound': { statusCode: 404, message: 'User Not Found' },
};

const create = async (userEmail, gameId, selectedTeam,  amount) => {
    try {
        await gameService.updateGamesStatusByDate();
        const game = await gameService.findById(gameId);
        if (!game.is_bets_open) {
            throw errors.betsClosed;
        }

        const user = await userService.getUserByEmail(userEmail);

        if (amount > user.balance) {
            throw errors.noBalance;
        }

        const teamSelection = selectedTeam === TeamSelection.team1 ? TeamSelection.team1 : TeamSelection.team2;

        const bet = await prisma.bet.create({
            data: {
                amount,
                selectedTeam: teamSelection,
                game: {
                    connect: { id: gameId }
                },
                user: {
                    connect: { id: user.id }
                },
            },
            include: {
                game: {
                    include: {
                        teamGame1: true,
                        teamGame2: true,
                    },
                },
            },
        });

        const updatedUser = await userService.reduceBalanceById(user.id, amount);
        
        const teamGameId1 = bet.game.teamGame1_id;
        const teamGameId2 = bet.game.teamGame2_id;

        const coefficients = _adjustOddsDynamically(
            bet.game.teamGame1.coefficient,
            bet.game.teamGame2.coefficient,
            bet.game.teamGame1.totalBid + (teamSelection === TeamSelection.team1 ? amount : 0),
            bet.game.teamGame2.totalBid + (teamSelection === TeamSelection.team2 ? amount : 0)
        );
        
        if(teamSelection === TeamSelection.team1) {
            await prisma.teamGame.update({
                where: { id: teamGameId1 },
                data: {
                    totalBid: {
                        increment: amount,
                    },
                    coefficient: parseFloat(coefficients.coefficient1),
                },
            });

            await prisma.teamGame.update({
                where: { id: teamGameId2 },
                data: {
                   coefficient: parseFloat(coefficients.coefficient2),
                },
            });
        } else {
            await prisma.teamGame.update({
                where: { id: teamGameId2 },
                data: {
                    totalBid: {
                        increment: amount,
                    },
                    coefficient: parseFloat(coefficients.coefficient2),
                },
            });

            await prisma.teamGame.update({
                where: { id: teamGameId1 },
                data: {
                    coefficient: parseFloat(coefficients.coefficient1),
                },
            });
        }

        const newBet = await prisma.bet.findFirst({
            where: {
                id: bet.id
            },
            include: {
                game: {
                    include: {
                        teamGame1: true,
                        teamGame2: true,
                    },
                },
                user: true,
            },
        })

        return {
            ...newBet,
            new_balance: updatedUser.balance,
        };
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            throw error;
        }

        throw errors.unknown;
    }
};

function _adjustOddsDynamically(coefTeam1, coefTeam2, totalBidTeam1, totalBidTeam2) {
    const totalBid = totalBidTeam1 + totalBidTeam2;
    const shareTeam1 = totalBidTeam1 / totalBid;
    const shareTeam2 = totalBidTeam2 / totalBid;

    const baseChange = Math.abs(shareTeam1 - shareTeam2);

    let newCoefTeam1 = coefTeam1 + baseChange * (shareTeam2 > shareTeam1 ? 1 : -1);
    let newCoefTeam2 = coefTeam2 + baseChange * (shareTeam1 > shareTeam2 ? 1 : -1);

    const minCoef = 1.01;
    const maxCoef = 100;
    newCoefTeam1 = Math.max(minCoef, Math.min(maxCoef, newCoefTeam1));
    newCoefTeam2 = Math.max(minCoef, Math.min(maxCoef, newCoefTeam2));

    return {
        coefficient1: newCoefTeam1.toFixed(3),
        coefficient2: newCoefTeam2.toFixed(3)
    };
}

const getActiveBetsByUserEmail = async (email, sort, is_active = true) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    const activeBets = await prisma.bet.findMany({
        where: {
            user_id: user.id,
            game: {
                is_active,
            },
        },
        include: {
            game: {
            include: {
                teamGame1: {
                    include: {
                        team: true,
                    }
                },
                teamGame2: {
                    include: {
                        team: true,
                    }
                },
            }
            }
        },
        orderBy: sort
    });

    return activeBets;
};

const getArchivedBetsByUserEmail = async (email) => {
    await gameService.updateGamesStatusByDate();

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
          bets: {
            where: {
              game: {
                is_active: false,
              },
            },
            include: {
              game: {
                include: {
                    teamGame1: {
                        include: {
                            team: true,
                        }
                    },
                    teamGame2: {
                        include: {
                            team: true,
                        }
                    },
                }
              }
            },
          },
        },
      });
  
      if (!user) {
        throw errors.userNotFound;
      }
  
      const activeBets = user.bets.filter((bet) => bet.game !== null);
  
      return activeBets;
}

const returnBet = async (id) => {
    const bet = await prisma.bet.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });

    await prisma.user.update({
        where: {
            id: bet.user_id,
        },
        data: {
            balance: {
                increment: bet.amount,
            },
        },
    });

    return await prisma.bet.update({
        where: {
            id,
        },
        data: {
            is_returned: true,
        },
    });
}

const returnBetsByGameId = async (id) => {
    const game = await prisma.game.findFirst({
        where: {
            id,
        },
        include: {
            bets: {
                include: {
                    user: true,
                },
            },
        },
    });

    const returnedBetsPromises = game.bets.map(async (bet) => {
        await prisma.user.update({
            where: {
                id: bet.user.id,
            },
            data: {
                balance: {
                    increment: bet.amount,
                },
            },
        });

        return prisma.bet.update({
            where: {
                id: bet.id,
            },
            data: {
                is_returned: true,
            },
        });
    });

    return Promise.all(returnedBetsPromises);
}


export default {
    create,
    getActiveBetsByUserEmail,
    getArchivedBetsByUserEmail,
    returnBet,
    returnBetsByGameId,
};