const express = require('express');
const { Contact } = require('../models');
const requireOwnership = require('../middleware/requireOwnership');
const {
  createContact,
  listContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

const router = express.Router();

router.post('/', createContact);
router.get('/', listContacts);
router.get('/:id', requireOwnership(Contact), getContact);
router.patch('/:id', requireOwnership(Contact), updateContact);
router.delete('/:id', requireOwnership(Contact), deleteContact);

module.exports = router;