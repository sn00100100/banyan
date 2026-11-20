const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getMe, updateMe, deleteMe } = require('../controllers/userController');

router.use(verifyToken);
router.get('/me', getMe);
router.patch('/me', updateMe);
router.delete('/me', deleteMe);

module.exports = router;