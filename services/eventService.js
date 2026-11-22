const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

async function getEvents(city) {
  const params = new URLSearchParams({
    apikey: process.env.TICKETMASTER_API_KEY,
    city,
    size: '10',
    startDateTime: new Date().toISOString().slice(0, 19) + 'Z',
    sort: 'date,asc'
  });

  const response = await fetch(`${BASE_URL}/events.json?${params}`);
  if (!response.ok) {
    const err = new Error(`Ticketmaster request failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const events = (data._embedded && data._embedded.events) || [];

  return events.map(e => {
    const venue = e._embedded && e._embedded.venues && e._embedded.venues[0];
    return {
      id: e.id,
      name: e.name,
      date: e.dates.start.localDate,
      time: e.dates.start.localTime || null,
      venue: venue ? venue.name : null,
      city: venue && venue.city ? venue.city.name : city,
      url: e.url
    };
  });
}

module.exports = { getEvents };