import teamService from '../service/teamService.js';

const create = async (req, res) => {
    const { name, image } = req.body;
    console.log(image)

    teamService.create(name, image)
        .then(team => {
            res.json(team);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const edit = async (req, res) => {
    const { id, name, image } = req.body;

    teamService.edit(id, name, image)
        .then(team => {
            res.json(team);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const deleteById = async (req, res) => {
    const { id } = req.body;

    teamService.deleteById(id)
        .then(r => {
            res.json(r);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const findByName = async (req, res) => {
    const { name } = req.query;

    if(!name) {
        teamService.findAll()
        .then(teams => {
            res.json(teams);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
    } else {
        teamService.findByName(name)
            .then(team => {
                res.json(team);
            }).catch(error => {
                const { statusCode, message } = error;
                res.status(statusCode).json({ error: message });
            });
    }
};

export default {
    create,
    findByName,
    deleteById,
    edit,
};