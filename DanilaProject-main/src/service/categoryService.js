import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const errors = {
    'unknown': { statusCode: 500, message: 'Internal Server Error' },
    'alreadyExists': { statusCode: 400, message: 'Category Already Exists' },
};

const create = async (name, channel_stream, image) => {
    try {
        const category = await prisma.category.create({
            data: {
                name,
                channel_stream,
                img: image,
            }
        });

        return category;
    } catch (error) {
        console.log(error)

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

const deleteById = async (id) => {
    try {
        await prisma.category.delete({
            where: {
                id
            },
        });

        return true;
    } catch (error) {
        throw errors.unknown;
    }
}

const getAll = async () => {
    try {
        const categories = await prisma.category.findMany();

        return categories;
    } catch (error) {
        console.log(error);
        throw errors.unknown;
    }
}

const findByName = async (name) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                name,
            },
        });

        return category;
    } catch (error) {
        console.log(error);
        throw errors.unknown;
    }
}

const edit = async (id, name, channel_stream, image) => {
    try {
        const data = {
            name,
            channel_stream,
            ...(image !== null && { img: image })
        };

        const team = await prisma.category.update({
            where: {
                id
            },
            data
        });

        return team;
    } catch (error) {
        console.log(error)

        throw errors.unknown;
    }
}

export default {
    create,
    getAll,
    findByName,
    deleteById,
    edit,
};