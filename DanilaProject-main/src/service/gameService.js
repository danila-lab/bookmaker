import { Prisma, PrismaClient } from '@prisma/client';
import teamService from './teamService.js';
import categoryService from './categoryService.js';

const prisma = new PrismaClient();

const errors = {
    'unknown': { statusCode: 500, message: 'Internal Server Error' },
    'alreadyExists': { statusCode: 400, message: 'Game Already Exists' },
    'team1NotFound': { statusCode: 404, message: 'Team1 Not Found' },
    'team2NotFound': { statusCode: 404, message: 'Team2 Not Found' },
    'categoryNotFound': { statusCode: 404, message: 'Category Not Found' },
};

const create = async (teamName1, coefficient1, teamName2, coefficient2, gameType, gameStartDate, gameFinishDate, categoryName) => {
    try {
        const category = await categoryService.findByName(categoryName);
        if (!category) {
            throw errors.categoryNotFound;
        }

        const team1 = await teamService.findByName(teamName1);
        if (!team1) {
            throw errors.team1NotFound;
        }

        const team2 = await teamService.findByName(teamName2);
        if(!team2) {
            throw errors.team2NotFound;
        }

        const teamGame1 = await _createTeamGame(team1.id, coefficient1);
        const teamGame2 = await _createTeamGame(team2.id, coefficient2);

        const game = await prisma.game.create({
            data: {
                teamGame1_id: teamGame1.id,
                teamGame2_id: teamGame2.id,
                type: gameType,
                game_start_date: new Date(gameStartDate),
                game_finish_date: new Date(gameFinishDate),
                category_id: category.id,
            },
            include: {
                category: true,
                teamGame1: {
                    include: {
                        team: true,
                    },
                },
                teamGame2: {
                    include: {
                        team: true,
                    },
                },
            },
        });

        const formattedGame = _formatGameCreateResponse(game);

        return formattedGame;
    } catch (error) {
        console.log(error);

        if (error.statusCode) {
            throw error;
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw errors.alreadyExists;
        } else {
            throw errors.unknown;
        }
    }
};

const findById = async (id) => {
    const game = await prisma.game.findFirst({
        where: {
            id
        },
        include: {
            category: true,
            teamGame1: {
                include: {
                    team: true,
                },
            },
            teamGame2: {
                include: {
                    team: true,
                },
            },
            bets: {
                include: {
                    user: true,
                },
            },
        },
    });

    const betsTeam1 = game.bets.filter(bet => bet.selectedTeam === 'team1');
    const betsTeam2 = game.bets.filter(bet => bet.selectedTeam === 'team2');

    const totalTeam1Amount = betsTeam1.reduce((acc, bet) => acc + bet.amount, 0);
    const totalTeam2Amount = betsTeam2.reduce((acc, bet) => acc + bet.amount, 0);

    game.betsTeam1 = betsTeam1;
    game.betsTeam2 = betsTeam2;
    game.totalTeam1Amount = totalTeam1Amount;
    game.totalTeam2Amount = totalTeam2Amount;
    game.totalAmount = totalTeam1Amount + totalTeam2Amount;

    // const totalAmount = game.bets.reduce((acc, bet) => acc + bet.amount, 0);

    // const totalTeam1Amount = game.bets
    //     .filter(bet => bet.selectedTeam === 'team1')
    //     .reduce((acc, bet) => acc + bet.amount, 0);

    // const totalTeam2Amount = game.bets
    //     .filter(bet => bet.selectedTeam === 'team2')
    //     .reduce((acc, bet) => acc + bet.amount, 0);

    // game.totalAmount = totalAmount;
    // game.totalTeam1Amount = totalTeam1Amount;
    // game.totalTeam2Amount = totalTeam2Amount;

    return game;
};

const _formatGameCreateResponse = (game) => {
    const { teamGame1, teamGame2 } = game;

    const formattedGame = {
        id: game.id,
        type: game.type,
        teamGame1: {
            id: teamGame1.id,
            coefficient: teamGame1.coefficient,
            team: teamGame1.team,
            totalBid: teamGame1.totalBid, 
        },
        teamGame2: {
            id: teamGame2.id,
            coefficient: teamGame2.coefficient,
            team: teamGame2.team,
            totalBid: teamGame2.totalBid,
        },
    };

    return formattedGame;
};

const _formatDate = (date) => {
    return new Date(date).toISOString;
}

const changeGameCoefficient = async (gameId, selectedTeam, newCoefficient) => {
    const game = await prisma.game.findFirst({
        where: {
            id: gameId,
        },
    });

    if (!game) {
        throw errors.gameNotFound;
    }

    let teamGameId = {};

    if (selectedTeam === TeamSelection.team1) {
        const teamGame = await prisma.teamGame.findFirst({
            where: {
                id: game.teamGame1_id,
            },
        });
        teamGameId = teamGame.id;
    } else {
        const teamGame = await prisma.teamGame.findFirst({
            where: {
                id: game.teamGame2_id,
            },
        });

        teamGameId = teamGame.id;
    }

    const updatedTeamGame = await prisma.teamGame.update({
        where: {
            id: teamGameId,
        },
        data: {
            coefficient: newCoefficient,
        }
    });

    return updatedTeamGame;
};

const updateGamesStatusByDate = async () => {
    const currentDate = new Date();

    const games = await prisma.game.findMany({
        where: {
            game_finish_date: {
                lt: currentDate,
            },
            is_active: true,
        },
        include: {
            teamGame1: true,
            teamGame2: true,
        }
    });

    await prisma.game.updateMany({
        where: {
            game_finish_date: {
                lt: currentDate,
            },
        },
        data: {
            is_active: false
        }
    });

    return await _closeBetsOnGameStartDate();
};

const _closeBetsOnGameStartDate = async () => {
    const currentDate = new Date();

    const games = await prisma.game.updateMany({
        where: {
            game_start_date: {
                lt: currentDate,
            },
            is_bets_open: true,
        },
        data: {
            is_bets_open: false
        }
    });

    return games;
};

const getActiveGames = async (name, type, is_active = true, sort) => {
    updateGamesStatusByDate();

    if(name === 'all') {
        return await prisma.game.findMany({
            where: {
                is_active,
                type,
            },
            include: {
                category: true,
                teamGame1: {
                    include: {
                        team: true,
                    },
                },
                teamGame2: {
                    include: {
                        team: true,
                    },
                },
            },
            orderBy: sort,
        });
    }

    return await prisma.game.findMany({
        where: {
            is_active,
            category: {
                name: name,
            },
            type,
        },
        include: {
            category: true,
            teamGame1: {
                include: {
                    team: true,
                },
            },
            teamGame2: {
                include: {
                    team: true,
                },
            },
        },
        orderBy: sort,
    });
};

const getArchivedGames = async (name, type) => {
    updateGamesStatusByDate();

    const games = await prisma.game.findMany({
        where: {
            is_active: false,
        },
        include: {
            category: true,
            teamGame1: {
                include: {
                    team: true,
                },
            },
            teamGame2: {
                include: {
                    team: true,
                },
            },
        },
    });

    return games;
}

const _createTeamGame = async (teamId, coefficient) => {
    const teamGame = await prisma.teamGame.create({
        data: {
            team_id: teamId,
            coefficient: coefficient,
        }
    });

    return teamGame;
};

const changeBetsStatus = async (id, is_bets_open) => {
    const game = await prisma.game.update({
        where: {
            id,
        },
        data: {
            is_bets_open: is_bets_open,
        },
    });

    return game;
};

const updateInfo = async(id, gameStartDate, gameFinishDate, coefficient1, coefficient2) => {
    const game = await prisma.game.findFirst({
        where: {
            id,
        },
        include: {
            teamGame1: true,
            teamGame2: true,
        }
    });
    await prisma.teamGame.update({
        where: {
            id: game.teamGame1.id,
        },
        data: {
            coefficient: coefficient1,
        },
    });
    await prisma.teamGame.update({
        where: {
            id: game.teamGame2.id,
        },
        data: {
            coefficient: coefficient2,
        },
    });
    const updatedGame = await prisma.game.update({
        where: {
            id,
        },
        data: {
            game_start_date: new Date(gameStartDate),
            game_finish_date: new Date(gameFinishDate),
        },
    });

    return updatedGame;
}

const getAwaitingResultGames = async () => {
    const games = await prisma.game.findMany({
        where: {
            is_active: false,
            team_won: null,
        },
        include: {
            category: true,
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
    });

    return games;
}

const setTeamWin = async (id, teamWon) => {
    const game = await prisma.game.update({
        where: {
            id: id,
        },
        data: {
            team_won: teamWon,
        },
    });

    const bets = await prisma.bet.findMany({
        where: {
            game_id: game.id
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

    bets.map(async bet => {
        if (bet.selectedTeam === bet.game.team_won) {
            const coef = bet.selectedTeam === 'team1' ? bet.game.teamGame1.coefficient : bet.game.teamGame2.coefficient;
            const win = bet.amount * coef;

            await prisma.user.update({
                where: {
                    id: bet.user_id,
                },
                data: {
                    balance: {
                        increment: win,
                    },
                },
            });
        }
    });
}

export default {
    create,
    findById,
    changeGameCoefficient,
    getActiveGames,
    updateGamesStatusByDate, // NO ROUTE
    getArchivedGames,
    changeBetsStatus,
    updateInfo,
    getAwaitingResultGames,
    setTeamWin,
};