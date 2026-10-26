const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CODES = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snowfall', 73: 'Moderate snowfall', 75: 'Heavy snowfall', 77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 97: 'Heavy thunderstorm',
    99: 'Thunderstorm with heavy hail'

}

// Returns true (outdoor) or false (indoor).
// Outdoor if clear/cloudy (codes 0-3) and 50-90°F.
// Thresholds are our choice, not an Open-Meteo rule.
function isOutdoorWeather(code, tempF) {
    return code <= 3 && tempF >= 50 && tempF <= 90;
}

// Looks up a city's current weather.
// Returns { city, state, temperature, weatherCode, description, suggestion }
// Returns null if the city isn't found
// Throws if Open-Meteo fails
async function getWeatherByCity(city) {
    const geoRes = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1`);
    if (!geoRes.ok) throw new Error(`Geocode failed: ${geoRes.status}`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) return null;
    const place = geoData.results[0];

    const forecastRes = await fetch(
        `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
    );

    if (!forecastRes.ok) throw new Error(`Forecast failed: ${forecastRes.status}`);
    const forecastData = await forecastRes.json();

    const temperature = forecastData.current.temperature_2m;
    const weatherCode = forecastData.current.weather_code;

    return {
        city: place.name,
        state: place.admin1 || null,
        temperature,
        weatherCode,
        description: WEATHER_CODES[weatherCode] || 'Unknown',
        suggestion: isOutdoorWeather(weatherCode, temperature) ? 'Outdoor' : 'Indoor'
    }
};

module.exports = { getWeatherByCity };