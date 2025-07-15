const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // <-- Needed for serving React app
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const adminRoutes = require('./routes/admin'); // <-- Admin routes
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
    // Allow requests with no origin or from allowed origins
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

// Body parser
app.use(express.json());

// ====== Serve static files from React frontend ======
app.use(express.static(path.join(__dirname, 'client/build')));

// ====== API Routes ======
app.use('/api', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes); // <-- Admin routes

// 404 handler for all unmatched /api routes (returns JSON)
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'API route not found' });
});

// ====== Catch-all: serve React's index.html for all other GET requests ======
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// ====== Error handling middleware ======
app.use(errorMiddleware);

// ✅ Export app for index.js/server.js
module.exports = app;
