import { Router } from 'express';
  
import adminController from './../controller/adminController.js';
import { authenticateToken, hasRole } from './../middleware/authMiddleware.js';
  
const router = Router(); 
  
router.post('/user/balance', authenticateToken, hasRole(['admin']), adminController.setUserBalanceById); 
router.post('/user/name', authenticateToken, hasRole(['admin']), adminController.changeUserNameById);
router.post('/user/email', authenticateToken, hasRole(['admin']), adminController.changeUserEmailById);
router.post('/user/ban', authenticateToken, hasRole(['admin']), adminController.changeUserLockedStatusById);
router.post('/game/coef', authenticateToken, hasRole(['admin']), adminController.changeGameCoefficient);

export default router;