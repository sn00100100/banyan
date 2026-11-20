require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connectDB = require('../db');
const { User } = require('../models');

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await User.findOneAndUpdate(
    { email },
    { $set: { name: 'Admin', role: 'admin', loginEnabled: true, passwordHash } },
    { upsert: true, new: true, runValidators: true }
  );

  console.log({ id: admin._id, email: admin.email, role: admin.role });
}

createAdmin()
  .catch(e => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());