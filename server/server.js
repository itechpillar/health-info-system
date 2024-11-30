require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, User, Student, HealthRecord } = require('./models');
const studentRoutes = require('./routes/students');
const healthRecordRoutes = require('./routes/healthRecords');
const authRoutes = require('./routes/auth');
const seedData = require('./seeders/seed');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/health-records', healthRecordRoutes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Health Records API' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
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
    console.log('Database connection has been established successfully.');

    // Sync models with database (without force)
    await sequelize.sync();
    console.log('Database synchronized');

    // Check if admin user exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminExists) {
      // Create default admin user if it doesn't exist
      await User.create({
        username: 'admin',
        password: 'admin123'  // Raw password, will be hashed by the model
      });
      console.log('Default admin user created');

      // Seed sample data only if it's a fresh database
      await seedData();
      console.log('Sample data seeded successfully');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
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
