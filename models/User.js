// Imports
const mongoose = require('mongoose');

// User Schema
const userSchema = mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
}, { timestamps: true });

// User Model
const User = mongoose.model('User', userSchema);

// Export
module.exports = User;
