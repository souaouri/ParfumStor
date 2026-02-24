import express from 'express';
import  { Login } from '../controllers/authControllers'

const router = express.Router();

// Define your authentication routes here
router.post('/login', Login);

router.post('/register', (req, res) => {
  // Handle registration logic
  res.send('Register route');
});

export default router;