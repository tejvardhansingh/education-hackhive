import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registeruser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists ❌' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Registered successfully ✅', user: newUser });
  } catch (err) {
    console.error(err);

    // Send a readable message instead of raw object
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0];
      return res.status(400).json({ message: firstError.message });
    }

    res.status(500).json({ message: 'Internal server error ❌' });
  }
};

export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    
    if (!user) 
      return res.status(404).json({ message: 'Username not found ❌' });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) 
      return res.status(400).json({ message: 'Invalid credentials ❌' });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '20h' }
    );

    // ✅ Send user info + token
    res.status(200).json({ message: 'Login Successful ✅', user, token });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error ❌', error: err.message });
  }
};
