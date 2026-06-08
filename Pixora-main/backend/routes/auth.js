const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Advanced Server-side Validation
    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check for existing user with detailed feedback
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'This username is already taken' });
    }

    const user = new User({ username, email, password });
    await user.save();

    console.log(`New user registered: ${username} (${email})`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        plan: user.plan,
        storageUsed: user.storageUsed || 0
      } 
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        plan: user.plan,
        storageUsed: user.storageUsed 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/auth/me - Get current user data
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        plan: user.plan,
        storageUsed: user.storageUsed
      }
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
