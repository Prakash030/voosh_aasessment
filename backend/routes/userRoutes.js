import express from 'express';
import { registerController, loginController } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerController); // Controller function to handle user registration
router.post('/login', loginController); // Controller function to handle user login

export default router;