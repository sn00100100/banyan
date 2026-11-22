const { getEvents } = require('../services/eventService');

exports.getLocalEvents = async (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) {
    return res.status(400).json({ message: 'city is required, e.g. ?city=Chicago' });
  }
  try {
    const events = await getEvents(city);
    res.json({ city, count: events.length, events });
  } catch (err) {
    res.status(502).json({ message: 'Event service unavailable', error: err.message });
  }
};