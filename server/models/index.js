const sequelize = require('../config/connection');
const StudentModel = require('./Student');
const HealthRecord = require('./HealthRecord');
const User = require('./User');

// Initialize models
const models = {
  StudentModel,
  HealthRecord,
  User
};

// Set up associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
