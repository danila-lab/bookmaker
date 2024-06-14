import { Router } from 'express';

// Local Modules
import gameController from './../controller/gameController.js';
import { authenticateToken, hasRole } from '../middleware/authMiddleware.js';

// Initialization
const router = Router();

// Requests
router.post('/', authenticateToken, hasRole(['admin']), gameController.create);
router.post('/changebetsstatus', authenticateToken, hasRole(['admin']), gameController.changeBetsStatus);
router.post('/update', authenticateToken, hasRole(['admin']), gameController.updateGameInfo);
router.post('/setteamwon', authenticateToken, hasRole(['admin']), gameController.setTeamWin);
router.get('/', gameController.getActiveGames);
router.get('/info', gameController.findById);
router.get('/archived', gameController.getArchivedGames);
router.get('/awaitingresult', gameController.getAwaitingResultGames);

export default router;