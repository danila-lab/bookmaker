import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config/authConfig.js';


const prisma = new PrismaClient();

const errors = {
    'unknown': { statusCode: 500, message: 'Internal Server Error' },
    'userNotFound': { statusCode: 404, message: 'User Not Found' },
    'incorrectPassword': { statusCode: 401, message: 'Incorrect password' },
    'insufficientBalance': { statusCode: 400, message: 'Insufficient balance' },
};

const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true,
            },
        });

        return users;
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            throw error;
        }

        throw errors.unknown;
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
            include: {
                role: true,
            },
        });

        return user;
    } catch (error) {
        throw errors.unknown;
    }
};

const getUserById = async (id) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: parseInt(id),
            },
            include: {
                role: true,
            },
        });

        return user;
    } catch (error) {
        console.log(error);
        throw errors.unknown;
    }
};

const reduceBalanceById = async (id, amount) => {
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                balance: {
                    decrement: amount,
                },
            },
        });

        return user;
    } catch (error) {
        throw errors.unknown;
    }
};

const setUserBalanceById = async (id, newBalance) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                balance: newBalance,
            },
        });

        return updatedUser;
    } catch (error) {
        throw errors.userNotFound;
    }
};

const setUserNameById = async (id, newName) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name: newName,
            },
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        
        throw errors.userNotFound;
    }
};

const setUserEmailById = async (id, newEmail) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                email: newEmail,
            },
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        
        throw errors.userNotFound;
    }
};

const changeIsLockedByUserId = async (id, status) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                is_locked: status,
            },
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw errors.userNotFound;
    }
}

const update = async (id, name, balance) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                balance,
            },
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw errors.userNotFound;
    }
}

const updateUserPassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw errors.unknown;
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        console.log(isPasswordMatch)
        if (!isPasswordMatch) {
            throw errors.incorrectPassword;
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedNewPassword
            }
        });

        return true;
    } catch (error) {
        throw errors.incorrectPassword;
    }
};

const deposit = async(id, amount, paymentMethod) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                balance: {
                    increment: parseFloat(amount)
                }
            },
        });

        const depositHistory = await prisma.depositHistory.create({
            data: {
                user_id: updatedUser.id,
                amount: parseFloat(amount),
                payment_method: paymentMethod,
                date: new Date(),
            },
        })

        return {
            ...updatedUser,
            depositHistory_id: depositHistory.id,
        };
    } catch (error) {
        console.log(error);
        throw errors.unknown;
    }
}

const withdraw = async(id, amount, receiver) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw errors.userNotFound;
        }

        if (user.balance < amount) {
            throw errors.insufficientBalance;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                balance: {
                    decrement: parseFloat(amount)
                }
            },
        });

        await prisma.withdrawHistory.create({
            data: {
                user_id: updatedUser.id,
                amount: parseFloat(amount),
                receiver: receiver,
                date: new Date(),
            },
        });

        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getTransactionsHistory(userId) {
    // Assuming you have a PrismaClient instance named prisma
    try {
        const depositHistory = await prisma.depositHistory.findMany({
            where: {
                user_id: parseInt(userId)
            },
            orderBy: {
                date: 'desc'
            }
        });

        const withdrawHistory = await prisma.withdrawHistory.findMany({
            where: {
                user_id: parseInt(userId)
            },
            orderBy: {
                date: 'desc'
            }
        });

        // Merge and sort deposit and withdraw history
        const transactionsHistory = [...depositHistory, ...withdrawHistory];
        transactionsHistory.sort((a, b) => b.date - a.date);

        return transactionsHistory;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export default {
    getAllUsers,
    getUserByEmail,
    reduceBalanceById,
    getUserById,
    setUserBalanceById,
    setUserNameById,
    setUserEmailById,
    changeIsLockedByUserId,
    update,
    updateUserPassword,
    deposit,
    withdraw,
    getTransactionsHistory,
};