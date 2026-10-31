const { User, Contact, Favor } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be user or admin' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contacts = await Contact.find({ owner: req.params.id });
    const contactIds = contacts.map(c => c._id);

    await Favor.deleteMany({ contact: { $in: contactIds } });
    await Contact.deleteMany({ owner: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and related data deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};