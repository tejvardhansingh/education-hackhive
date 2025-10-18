import express from 'express';
import { registeruser, loginuser } from '../controllers/user.js';
import User from '../models/User.js';

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', registeruser);
router.post('/login', loginuser);

export default router;
