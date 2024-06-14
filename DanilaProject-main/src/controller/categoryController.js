import categoryService from '../service/categoryService.js';

const getAll = async (req, res) => {
    try {
        const categories = await categoryService.getAll();

        res.json(categories);
    } catch (error) {
        console.log(error);
        const { statusCode = 500, message } = error;
        res.status(statusCode).json({ error: message });
    }
};

const edit = async (req, res) => {
    const { id, name, channel_stream, image } = req.body;

    categoryService.edit(id, name, channel_stream, image)
        .then(team => {
            res.json(team);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const create = async (req, res) => {
    const { name, channel_stream, image } = req.body;

    categoryService.create(name, channel_stream, image)
        .then(category => {
            res.json(category);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const deleteById = async (req, res) => {
    const { id } = req.body;

    categoryService.deleteById(id)
        .then(r => {
            res.json(r);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

export default {
    getAll,
    create,
    deleteById,
    edit,
};