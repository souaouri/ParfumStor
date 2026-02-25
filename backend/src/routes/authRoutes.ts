import express from 'express';
import  { Login, Logout, Register } from '../controllers/authControllers'

const router = express.Router();

// Define your authentication routes here
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/register', Register);

export default router;