import { Router } from 'express';

import categoryController from './../controller/categoryController.js';
import { authenticateToken, hasRole } from './../middleware/authMiddleware.js';

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', authenticateToken, hasRole(['admin']), categoryController.create);
router.post('/delete', authenticateToken, hasRole(['admin']), categoryController.deleteById);
router.post('/edit', authenticateToken, hasRole(['admin']), categoryController.edit);

export default router;