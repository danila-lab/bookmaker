import authService from '../service/authService.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;

    authService.register(name, email, password)
        .then(user => {
            res.json(user);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    authService.login(email, password)
        .then((response) => {
            res.status(200).json({ message: 'Success', ...response });
        }).catch(error => {
            console.log(error);
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const authenticateToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        res.status(403);
        return;
    }

    const r = authService.authenticateToken(token)
        .then(r => {
            if(r) {
                res.status(200).json(r);
            }

            res.status(403);
        }).catch(error => {
            console.log(error);
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

export default {
    register,
    login,
    authenticateToken,
};