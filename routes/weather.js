const express = require('express');
const { getWeatherByCity } = require('../services/weather');

const router = express.Router();


// Get/api/weather?city=<name>
router.get('/', async (req, res)=> {
    console.log(`GET /api/weather?city=${req.query.city}`);

    const city = req.query.city;
    if (!city || !city.trim()) {
        return res.status(400).json({ error: 'Please enter a city name'});
    }

    try {
        const weather = await getWeatherByCity(city.trim());
        if (!weather){
            return res.status(404).json({ error: 'City not found.'}); 
        }
        res.json(weather);
    } catch(err){
        console.error('Weather lookup failed:', err.message);
        return res.status(502).json({ error: 'Weather Services Unavailable'});
    }
});

module.exports = router;