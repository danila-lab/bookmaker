import { Router } from 'express';

import userController from './../controller/userController.js';
import { authenticateToken, hasRole } from './../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, hasRole(['admin']), userController.getAllUsers);
router.get('/info', authenticateToken, userController.getUserById);
router.post('/banmyself', authenticateToken, hasRole(['user']), userController.banSelfUser);
router.post('/update', authenticateToken, hasRole(['admin']), userController.update);
router.post('/ban', authenticateToken, hasRole(['admin']), userController.banUserById);
router.post('/unban', authenticateToken, hasRole(['admin']), userController.unBanUserById);
router.post('/changepassword', authenticateToken, userController.changePassword);
router.post('/deposit', authenticateToken, userController.deposit);
// router.get('/deposit', userController.deposit);
router.post('/withdraw', authenticateToken, userController.withdraw);
router.get('/transactions', authenticateToken, userController.getTransactionsHistory);

export default router;