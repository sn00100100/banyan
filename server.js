require('dotenv').config();
const express = require('express);
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes go here. Each member adds their own app.use('/api/...') line.

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
