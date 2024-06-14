import gameService from '../service/gameService.js';

const create = async (req, res) => {
    const { team_name_1, coefficient_1, team_name_2, coefficient_2, game_type, game_start_date, game_finish_date, category_name } = req.body;

    gameService.create(team_name_1, coefficient_1, team_name_2, coefficient_2, game_type, game_start_date, game_finish_date, category_name)
        .then(game => {
            res.json(game);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const getActiveGames = async (req, res) => {
    const { category, type, is_active, sort, order } = req.query;

    let formattedSort = {};

    switch(sort) {
        case 'startDate':
            formattedSort = {
                game_start_date: order
            };
            break;
        case 'finishDate':
            formattedSort = {
                game_finish_date: order
            };
            break;
        case 'id':
            formattedSort = {
                id: order
            };
            break;
        case 'team1':
            formattedSort = {
                teamGame1: {
                    coefficient: order
                }
            };
            break;
        case 'team2':
            formattedSort = {
                teamGame2: {
                    coefficient: order
                }
            };
            break;
        default:
            formattedSort = {
                id: 'desc'
            };
            break
    };

    const active = is_active === "1" ? true : false;

    gameService.getActiveGames(category, type, active, formattedSort)
        .then(games => {
            res.json(games);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const getArchivedGames = async (req, res) => {
    const { category, type, is_active } = req.query;

    gameService.getArchivedGames(category, type, is_active)
        .then(games => {
            res.json(games);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const findById = async (req, res) => {
    const { id } = req.query;

    gameService.findById(parseInt(id))
        .then(r => {
            res.json(r);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const changeBetsStatus = async (req, res) => {
    const { id, is_bets_open } = req.body;

    gameService.changeBetsStatus(parseInt(id), is_bets_open)
        .then(r => {
            res.json(r);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const updateGameInfo = async (req, res) => {
    const { id, game_start_date, game_finish_date, coefficient_1, coefficient_2 } = req.body;

    gameService.updateInfo(id, game_start_date, game_finish_date, coefficient_1, coefficient_2)
    .then(r => {
        res.json(r);
    }).catch(error => {
        console.log(error);

        const { statusCode, message } = error;
        res.status(statusCode).json({ error: message });
    });
}

const getAwaitingResultGames = async (req, res) => {
    gameService.getAwaitingResultGames()
        .then(r => {
            res.json(r);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const setTeamWin = async (req, res) => {
    const { id, teamWon } = req.body;

    gameService.setTeamWin(id, teamWon)
    .then(r => {
        res.json(r);
    }).catch(error => {
        console.log(error);

        const { statusCode, message } = error;
        res.status(statusCode).json({ error: message });
    });
}

export default {
    create,
    getActiveGames,
    getArchivedGames,
    findById,
    changeBetsStatus,
    updateGameInfo,
    getAwaitingResultGames,
    setTeamWin,
};