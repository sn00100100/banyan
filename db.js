require('dotenv').config();
const mongoose = require('mongoose');
const DEFAULT_URI = 'mongodb://127.0.0.1:27017/banyan_checkpoint2_yixu';

async function connectDB(uri = process.env.MONGODB_URI || DEFAULT_URI) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  return mongoose.connection;
}
module.exports = connectDB;
module.exports.DEFAULT_URI = DEFAULT_URI;
