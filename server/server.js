const express = require('express');
const cors = require('cors');
const { sequelize, User, Student, HealthRecord } = require('./models');
const studentRoutes = require('./routes/students');
const healthRecordRoutes = require('./routes/healthRecords');
const authRoutes = require('./routes/auth');
const seedData = require('./seeders/seed');
const path = require('path');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://health-records-client.onrender.com',
  'https://health-info-system.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server and sync database
const start = async () => {
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
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

start();
