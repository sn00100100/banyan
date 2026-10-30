require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const verifyToken = ('./middleware/verifyToken');

const app = express();
const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err.message));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes go here. Each member adds their own app.use('/api/...') line.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Protected routes: mount with verifyToken (Member 1's middleware).
// Uncomment once the route file exists.
// app.use('/api/contacts', verifyToken, require('./routes/contactRoutes'));
// app.use('/api/favors', verifyToken, require('./routes/favorRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
