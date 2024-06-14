import betService from '../service/betService.js';
import gameService from '../service/gameService.js';
import userService from '../service/userService.js';

const setUserBalanceById = async (req, res) => {
    const { user_id, new_balance } = req.body;

    userService.setUserBalanceById(user_id, new_balance)
        .then(user => {
            res.json(user);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const changeUserNameById = async (req, res) => {
    const { user_id, new_name } = req.body;

    userService.setUserNameById(user_id, new_name)
        .then(user => {
            res.json(user);
        }).catch(error => {
            console.log(error);
            
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const changeUserEmailById = async (req, res) => {
    const { user_id, new_email } = req.body;

    userService.setUserEmailById(user_id, new_email)
        .then(user => {
            res.json(user);
        }).catch(error => {
            console.log(error);
            
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const changeGameCoefficient = async (req, res) => {
    const { game_id, selected_team, new_coefficient } = req.body;

    gameService.changeGameCoefficient(game_id, selected_team, new_coefficient)
        .then(r => {
            res.json(r);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const changeUserLockedStatusById = async (req, res) => {
    const { user_id, is_locked } = req.body;

    userService.changeIsLockedByUserId(user_id, is_locked)
        .then(user => {
            res.json(user);
        }).catch(error => {
            console.log(error);

            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

export default {
    setUserBalanceById,
    changeUserNameById,
    changeUserEmailById,
    changeGameCoefficient,
    changeUserLockedStatusById,
};