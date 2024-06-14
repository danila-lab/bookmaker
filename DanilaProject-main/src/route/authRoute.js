import { Router } from 'express';

// Local Modules
import authController from './../controller/authController.js';

// Initialization
const router = Router();

// Requests
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/token', authController.authenticateToken);

export default router;