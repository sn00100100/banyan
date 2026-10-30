const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController');

router.get('/users', verifyToken, requireRole('admin'), getAllUsers);
router.patch('/users/:id/role', verifyToken, requireRole('admin'), updateUserRole);
router.delete('/users/:id', verifyToken, requireRole('admin'), deleteUser);

module.exports = router;
