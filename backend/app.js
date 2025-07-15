const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const adminRoutes = require('./routes/admin');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS Middleware
const allowedOrigins = [
  'https://fixmate-3.onrender.com', // Your deployed frontend
  'http://localhost:3000'           // For local development
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// 1️⃣ Serve React static assets BEFORE API routes!
app.use(express.static(path.join(__dirname, 'client/build')));

// 2️⃣ API routes
app.use('/api', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);

// 3️⃣ 404 for unmatched /api
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'API route not found' });
});

// 4️⃣ Wildcard: serve React app for anything else
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 5️⃣ Final error handler
app.use(errorMiddleware);

module.exports = app;
