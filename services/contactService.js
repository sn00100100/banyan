const { Contact } = require('../models');

const EDITABLE_FIELDS = ['name', 'relationship', 'city', 'birthday'];

function pickEditable(data) {
  const result = {};
  for (const field of EDITABLE_FIELDS) {
    if (data[field] !== undefined) result[field] = data[field];
  }
  return result;
}

async function createContact(ownerId, data) {
  return Contact.create({ ...pickEditable(data), owner: ownerId });
}

async function listContacts(ownerId) {
  return Contact.find({ owner: ownerId }).sort({ name: 1 });
}

async function updateContact(contact, data) {
  Object.assign(contact, pickEditable(data));
  return contact.save();
}

async function deleteContact(contact) {
  await contact.deleteOne();
}

module.exports = { createContact, listContacts, updateContact, deleteContact };