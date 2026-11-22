const express = require('express');
const { getNext } = require('../controllers/holidayController');

const router = express.Router();

router.get('/next', getNext);

module.exports = router;