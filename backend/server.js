require('dotenv').config();
const express = require('express');
const cors = require('cors');
const extractController = require('./controllers/extractController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Routes
app.post('/extract', extractController.extractContent);
app.get('/', (req, res) => {
    res.send('Web Content Extractor API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
