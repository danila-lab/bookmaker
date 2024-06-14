import authService from '../service/authService.js';
import betService from '../service/betService.js';

const create = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const email = authService.getUserEmailFromToken(token);

    const { game_id, selected_team, amount } = req.body;

    betService.create(email, game_id, selected_team, amount)
        .then((bet) => {
            res.json(bet);
        }).catch((error) => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const getUserActiveBetsByEmail = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const { email = authService.getUserEmailFromToken(token), sort, order, active } = req.query;

    let formattedSort = {};
    const is_active = active === '0' ? false : true;

    switch(sort) {
        case 'date':
            const date = is_active ? 'game_start_date' : 'game_finish_date';
            formattedSort = {
                game: {
                    [date]: order
                }
            };
            break;
        case 'amount':
            formattedSort = {
                amount: order
            };
            break;
        case 'id':
            formattedSort = {
                id: order
            };
            break;
        default:
            formattedSort = {
                id: 'desc'
            };
            break
    };

    // betService.getActiveBetsByUserEmail(email)
    betService.getActiveBetsByUserEmail(email, formattedSort, is_active)
        .then((bets) => {
            res.json(bets);
        }).catch((error) => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const getUserArchivedBetsByEmail = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // const email = authService.getUserEmailFromToken(token);
    const { email = authService.getUserEmailFromToken(token) } = req.query;

    betService.getArchivedBetsByUserEmail(email)
        .then((bets) => {
            res.json(bets);
        }).catch((error) => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const returnBet = async (req, res) => {
    const { id } = req.body;
    betService.returnBet(id)
        .then((bet) => {
            res.json(bet);
        }).catch((error) => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const returnBetsByGameId  = async (req, res) => {
    const { id } = req.body;

    betService.returnBetsByGameId(id)
        .then(bets => {
            res.json(bets);
        }).catch((error) => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

export default {
    create,
    getUserActiveBetsByEmail,
    getUserArchivedBetsByEmail,
    returnBet,
    returnBetsByGameId,
};