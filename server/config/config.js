require('dotenv').config();

// If DATABASE_URL exists (Render), use it. Otherwise, use local config
const useLocalDB = !process.env.DATABASE_URL;

const config = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'health_records_dev',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'health_records_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: useLocalDB ? {
    // Local production settings
    username: 'postgres',
    password: 'postgres',
    database: 'health_records',
    host: '127.0.0.1',
    dialect: 'postgres'
  } : {
    // Render production settings
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

console.log(`Using ${useLocalDB ? 'local' : 'Render'} database configuration`);

module.exports = config;
