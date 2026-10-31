// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Function to check if email is valid
function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check name
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check email; Return invalid message for invalid email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email'
      });
    }

    // Check password length and return message if for incorrect length
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, email, passwordHash, loginEnabled: true 
    });
    res.status(201).json({ id: newUser._id, email: newUser.email, role: newUser.role});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !user.loginEnabled || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};