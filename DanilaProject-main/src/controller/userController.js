import userService from '../service/userService.js';
import authService from '../service/authService.js';
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

const getAllUsers = async (req, res) => {
    userService.getAllUsers()
        .then(users => {
            res.json(users);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const getUserById = async (req, res) => {
    const { id } = req.query;

    userService.getUserById(id)
        .then(user => {
            res.json(user);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const banSelfUser = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const email = authService.getUserEmailFromToken(token);
    const user = await userService.getUserByEmail(email);
    userService.changeIsLockedByUserId(user.id, true)
        .then(users => {
            res.json(users);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const banUserById = async (req, res) => {
    const { id } = req.body;

    userService.changeIsLockedByUserId(id, true)
    .then(r => {
        res.json(r);
    }).catch(error => {
        const { statusCode, message } = error;
        res.status(statusCode).json({ error: message });
    });
};

const unBanUserById = async (req, res) => {
    const { id } = req.body;

    userService.changeIsLockedByUserId(id, false)
    .then(r => {
        res.json(r);
    }).catch(error => {
        const { statusCode, message } = error;
        res.status(statusCode).json({ error: message });
    });
};

const update = async (req, res) => {
    const { id, name, balance } = req.body;

    userService.update(id, name, balance)
        .then(user => {
            res.json(user);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
};

const changePassword = async (req, res) => {
    const { old_password, new_password } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const email = authService.getUserEmailFromToken(token);
    const user = await userService.getUserByEmail(email);
    userService.updateUserPassword(user.id, old_password, new_password)
        .then(r => {
            res.json(r);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const deposit = async (req, res) => {
    const { id, amount, payment_method } = req.body;

    userService.deposit(id, amount, payment_method)
        .then(r => {
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Length', pdfData.length);
                res.send(pdfData);
            });

            // add your content to the document here, as usual
            doc
            .fontSize(18)
            .text(`Check number: ${r.depositHistory_id}`)
            .text(`Deposit amount: ${parseFloat(amount).toFixed(2)}€`)
            .text(`Payment method: ${payment_method}`)
            .text(`Customer email: ${r.email}`)
            .text(`Customer name: ${r.name}`)
            .text(`New balance: ${r.balance.toFixed(2)}€`)
            .text(`Date: ${new Date()}`)
            .moveDown()
            .text('Company name: eWager', { align: 'right' })
            .text('Company bank account number: NJ1238891KS8952', { align: 'right' })
            .text('Company registration number: LV123912323214', { align: 'right' });

            // finalize the PDF and end the stream
            doc.end();
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode || 500).json({ error: message });
        });
}

const withdraw = async (req, res) => {
    const { id, amount, receiver } = req.body;

    userService.withdraw(id, amount, receiver)
        .then(r => {
            res.json(r);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

const getTransactionsHistory = async (req, res) => {
    const { id } = req.query;

    userService.getTransactionsHistory(id)
        .then(r => {
            res.json(r);
        }).catch(error => {
            const { statusCode, message } = error;
            res.status(statusCode).json({ error: message });
        });
}

export default {
    getAllUsers,
    banSelfUser,
    getUserById,
    update,
    changePassword,
    deposit,
    withdraw,
    getTransactionsHistory,
    banUserById,
    unBanUserById,
};