// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Function to check if email is valid
function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email; Return invalid message for invalid email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email'
      });
    }

    // Check password length and return message if for inccorrect length
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at leasat 6 characters' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }
  }
}