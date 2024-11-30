require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
  app.use(express.static(path.join(__dirname, 'public')));
}

// API Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/health-records', require('./routes/healthRecords'));

// API welcome route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Health Records API',
    environment: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? 'Render PostgreSQL' : 'Local PostgreSQL'
  });
});

// Handle React routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Server error', 
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message 
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database
    await sequelize.sync();
    console.log('Database synced successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Database: ${process.env.DATABASE_URL ? 'Render PostgreSQL' : 'Local PostgreSQL'}`);
      if (process.env.NODE_ENV === 'production') {
        console.log('Serving React app from:', path.join(__dirname, 'public'));
      }
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
