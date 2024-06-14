import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const errors = {
    'unknown': { statusCode: 500, message: 'Internal Server Error' },
    'alreadyExists': { statusCode: 400, message: 'Team Already Exists' },
};

const create = async (name, image) => {
    try {
        const team = await prisma.team.create({
            data: {
                name,
                img: image
            }
        });

        return team;
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

const edit = async (id, name, image) => {
    try {
        const data = {
            name,
            ...(image !== null && { img: image })
        };

        const team = await prisma.team.update({
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
};

const deleteById = async (id) => {
    try {
        await prisma.team.delete({
            where: {
                id
            },
        });

        return true;
    } catch (error) {
        console.log(error)

        throw errors.unknown;
    }
}

const findByName = async (name) => {
    try {
        const team = await prisma.team.findFirst({
            where: {
                name
            }
        });

        return team;
    } catch (error) {
        throw errors.unknown;
    }
};

const findAll = async () => {
    try {
        const team = await prisma.team.findMany();

        return team;
    } catch (error) {
        throw errors.unknown;
    }
};

export default {
    create,
    findByName,
    findAll,
    deleteById,
    edit,
};