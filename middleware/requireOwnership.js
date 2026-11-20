const mongoose = require('mongoose');

module.exports = function requireOwnership(Model) {
  return async function (req, res, next) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      const doc = await Model.findById(req.params.id);
      if (!doc || doc.owner.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Not found' });
      }

      req.resource = doc;
      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
};