// Imports
const assert = require('node:assert/strict');
const fs = require('node:fs');
const mongoose = require('mongoose');
const connectDB = require('../db');
const { User, Contact, Favor } = require('../models');

const DB_NAME = 'banyan_checkpoint2_yixu';

async function verify() {
  await connectDB();
  assert.equal(mongoose.connection.name, DB_NAME);

  // Load data
  const users = await User.find().sort({ email: 1 }).lean();
  const contacts = await Contact.find().sort({ name: 1 }).lean();
  const favors = await Favor.find().populate('contact', 'name city').lean();

  // Counts
  assert.equal(users.length, 2);
  assert.equal(contacts.length, 3);
  assert.equal(favors.length, 3);

  // Every favor points to a real contact with the same owner
  for (const favor of favors) {
    const contact = contacts.find(c => c._id.equals(favor.contact._id));
    assert.ok(contact);
    assert.ok(contact.owner.equals(favor.owner));
  }

  // Ownership isolation: second user owns no contacts
  const other = users.find(u => u.email === 'jamie.demo@example.com');
  assert.equal(await Contact.countDocuments({ owner: other._id }), 0);

  // Validation rules
  await assert.rejects(
    new Favor({
      owner: users[0]._id,
      contact: contacts[0]._id,
      direction: 'invalid',
      size: 'large',
      occurredAt: new Date()
    }).validate()
  );
  await assert.rejects(new User({ name: 'Bad', email: 'not-an-email' }).validate());

  // Unique email index
  await assert.rejects(
    User.create({ name: 'Duplicate', email: users[0].email }),
    e => e.code === 11000
  );

  // Evidence file
  const isAtlas = (process.env.MONGODB_URI || '').includes('mongodb.net');
  const evidence = {
    verifiedAt: new Date().toISOString(),
    environment: isAtlas ? 'MongoDB Atlas' : 'Local MongoDB',
    database: mongoose.connection.name,
    mongodbVersion: (await mongoose.connection.db.admin().serverInfo()).version,
    checks: [
      '2 users, 3 contacts, 3 favors persisted',
      'Favor references resolve and owner IDs match',
      'Owner-filtered query returns no contacts for second demo user',
      'Invalid email and favor direction rejected by Mongoose',
      'Duplicate email rejected by MongoDB unique index'
    ],
    users,
    contacts,
    favors
  };

  fs.writeFileSync('verification-results.json', JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
}

verify()
  .catch(e => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());