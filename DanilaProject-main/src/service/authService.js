import bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from '@prisma/client';
import { SALT_ROUNDS } from '../config/authConfig.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import userService from './userService.js';


const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET;

const errors = {
    'unknown': { statusCode: 500, message: 'Internal Server Error' },
    'userAlreadyExists': { statusCode: 409, message: 'User with this email already exists' },
    'userNotFound': { statusCode: 404, message: 'User not found' },
    'userBanned': { statusCode: 403, message: 'User banned' },
    'incorrectPassword': { statusCode: 400, message: 'Incorrect password' },
};

const register = async (name, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const userRoleName = 'user';

        const userRole = await prisma.role.findFirst({
            where: {
                name: userRoleName
            }
        });

        if (!userRole) {
            throw errors.unknown;
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role_id: userRole.id
            }
        });

        return user;
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
        ) {
            throw errors.userAlreadyExists;
        } else {
            throw errors.unknown;
        }
    }
};

const login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            role: true,
        }
    });

    if (!user) {
        throw errors.userNotFound;
    }

    if (user.is_locked) {
        throw errors.userBanned;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw errors.incorrectPassword;
    }

    const jwtToken = _generateJwtToken(email);

    return {
        balance: user.balance,
        token: jwtToken,
        id: user.id,
        role: user.role.name,
    };
};

const authenticateToken = (token) => {
    try {
        // jwt.verify(token, jwtSecret);
        return jwt.verify(token, jwtSecret, async (error, data) => {
            if (error) {
              console.log(error);
              return null;
            }

            const user = await userService.getUserByEmail(data.email);

            if(user.is_locked) {
                return null;
            }


            return user;
          });
    } catch (error) {
        return null;
    }
}


const getUserEmailFromToken = (token) => {
    const { email } = jwt.decode(token);
    return email;
}

const _generateJwtToken = (email) => {
    return jwt.sign({ email }, jwtSecret, { expiresIn: "30d" });
};

export default {
    register,
    login,
    getUserEmailFromToken,
    authenticateToken,
};