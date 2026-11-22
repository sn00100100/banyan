const express = require('express');
const { getLocalEvents } = require('../controllers/eventController');

const router = express.Router();

router.get('/', getLocalEvents);

module.exports = router;