const BASE_URL = 'https://date.nager.at/api/v3';

async function getNextHolidays(countryCode) {
  const response = await fetch(`${BASE_URL}/NextPublicHolidays/${countryCode}`);
  if (!response.ok) {
    const err = new Error(`Nager.Date request failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }
  const data = await response.json();
  return data.map(h => ({
    date: h.date,
    name: h.name,
    localName: h.localName,
    countryCode: h.countryCode
  }));
}

module.exports = { getNextHolidays };