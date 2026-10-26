require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes go here. Each member adds their own app.use('/api/...') line.

app.use('/api/weather', require('./routes/weather'));



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
