const contactService = require('../services/contactService');

function handleError(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid contact data', error: err.message });
  }
  res.status(500).json({ message: 'Server error', error: err.message });
}

exports.createContact = async (req, res) => {
  try {
    const contact = await contactService.createContact(req.user.id, req.body);
    res.status(201).json(contact);
  } catch (err) {
    handleError(res, err);
  }
};

exports.listContacts = async (req, res) => {
  try {
    const contacts = await contactService.listContacts(req.user.id);
    res.json(contacts);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getContact = (req, res) => {
  res.json(req.resource);
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await contactService.updateContact(req.resource, req.body);
    res.json(contact);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await contactService.deleteContact(req.resource);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    handleError(res, err);
  }
};