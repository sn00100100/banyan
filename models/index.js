const mongoose = require('mongoose');
const { Schema } = mongoose;
const options = { timestamps: true, strict: 'throw' };
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  loginEnabled: { type: Boolean, default: false },
  passwordHash: { type: String, select: false }
}, options);
userSchema.index({ email: 1 }, { unique: true });
const contactSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  relationship: { type: String, enum: ['friend', 'family', 'colleague', 'other'], required: true },
  city: { type: String, required: true },
  birthday: Date,
  lastInteractionAt: Date
}, options);
const favorSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  contact: { type: Schema.Types.ObjectId, ref: 'Contact', required: true, index: true },
  direction: { type: String, enum: ['given', 'received'], required: true },
  size: { type: String, enum: ['small', 'medium', 'large'], required: true },
  note: { type: String, maxlength: 2000 },
  occurredAt: { type: Date, required: true }
}, options);
module.exports = {
  User: mongoose.models.User || mongoose.model('User', userSchema),
  Contact: mongoose.models.Contact || mongoose.model('Contact', contactSchema),
  Favor: mongoose.models.Favor || mongoose.model('Favor', favorSchema)
};
