import { Router } from 'express';

import teamController from '../controller/teamController.js';
import { authenticateToken, hasRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, hasRole(['admin']), teamController.create);
router.post('/delete', authenticateToken, hasRole(['admin']), teamController.deleteById);
router.post('/edit', authenticateToken, hasRole(['admin']), teamController.edit);
router.get('/', teamController.findByName);

export default router;