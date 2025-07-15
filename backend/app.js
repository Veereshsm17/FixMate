const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'], // ✅ Add your deployed frontend URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes); // <-- Admin routes

// 404 handler for all unmatched /api routes (returns JSON)
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'API route not found' });
});

// Error handling middleware
app.use(errorMiddleware);

// ✅ Instead of app.listen, export app
module.exports = app;
