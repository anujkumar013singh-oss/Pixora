const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('../backend/routes/auth');
const conversionRoutes = require('../backend/routes/conversion');
const historyRoutes = require('../backend/routes/history');
const redirectRoutes = require('../backend/routes/redirect');
const errorHandler = require('../backend/middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/conversion', conversionRoutes);
app.use('/api/history', historyRoutes);
app.use('/s', redirectRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;
