const { getNextHolidays } = require('../services/holidayService');

exports.getNext = async (req, res) => {
  const country = (req.query.country || 'US').toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) {
    return res.status(400).json({ message: 'country must be a 2-letter code, e.g. US' });
  }
  try {
    const holidays = await getNextHolidays(country);
    res.json({ country, count: holidays.length, holidays });
  } catch (err) {
    res.status(502).json({ message: 'Holiday service unavailable', error: err.message });
  }
};