const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Student = require('./entities/Student');

class StudentModel extends Model {
  toEntity(healthRecords = []) {
    return Student.fromDatabase(this.toJSON(), healthRecords);
  }
}

StudentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bloodType: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'StudentModel',
    tableName: 'Students',
    timestamps: true
  }
);

// Define associations
StudentModel.associate = (models) => {
  StudentModel.hasMany(models.HealthRecord, {
    foreignKey: 'studentId',
    sourceKey: 'id',
    as: 'healthRecords',
    onDelete: 'CASCADE'
  });
};

module.exports = StudentModel;
