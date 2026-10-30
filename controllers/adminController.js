const { User, Contact, Favor } = require('../models');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  );
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const contacts = await Contact.find({ owner: req.params.id });
  const contactIds = contacts.map(c => c._id);

  await Favor.deleteMany({ contact: { $in: contactIds } });
  await Contact.deleteMany({ owner: req.params.id });
  await User.findByIdAndDelete(req.params.id);

  res.json({ message: 'User and related data deleted' });
};