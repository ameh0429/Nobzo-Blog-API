import express from 'express';
import authController from '../controllers/authController.js';
import {
  registerValidation,
  loginValidation,
} from '../validators/index.js';

const router = express.Router();

// Register and Login Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

export default router;