const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getMe, updateMe } = require('../controllers/userController');

router.use(verifyToken);
router.get('/me', getMe);
router.patch('/me', updateMe);

module.exports = router;