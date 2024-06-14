import { Router } from 'express';

import betController from './../controller/betController.js';
import { authenticateToken, hasRole } from './../middleware/authMiddleware.js';


const router = Router();

router.post('/', authenticateToken, hasRole(['user', 'admin']), betController.create);
router.get('/', authenticateToken, betController.getUserActiveBetsByEmail);
router.get('/history', authenticateToken, betController.getUserArchivedBetsByEmail);
router.post('/return', authenticateToken, hasRole(['admin']), betController.returnBet);
router.post('/returnbygame', authenticateToken, hasRole(['admin']), betController.returnBetsByGameId);

export default router;