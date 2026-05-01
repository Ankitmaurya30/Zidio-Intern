import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use mock data instead of MongoDB connection
console.log('Using mock data instead of MongoDB connection');

// Import routes
import mockRoutes, { setMockDB } from './backend/routes/mockRoutes.js';

// Setup mock database
const mockDB = {
  users: [
    {
      _id: '68cbb624b556086124dd9cd5',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      createdAt: new Date().toISOString()
    }
  ],
  blogs: []
};

// Set mock database for routes
setMockDB(mockDB);

// Define Routes
app.use('/api', mockRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blogging Platform API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));