const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class HealthRecord extends Model {}

HealthRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    recordDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    recordType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Weight in kilograms'
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Height in centimeters'
    },
    bloodPressure: {
      type: DataTypes.STRING,
      allowNull: true
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medicalNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    treatmentPlan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nextAppointment: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'HealthRecord',
    tableName: 'HealthRecords',
    timestamps: true
  }
);

// Define association with Student
HealthRecord.associate = (models) => {
  HealthRecord.belongsTo(models.Student, {
    foreignKey: 'studentId',
    targetKey: 'id',
    as: 'student'
  });
};

// Instance methods
HealthRecord.prototype.getBMI = function() {
  if (!this.weight || !this.height) {
    return null;
  }
  // Convert height from cm to meters
  const heightInMeters = this.height / 100;
  // Calculate BMI: weight (kg) / height² (m²)
  const bmi = this.weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
};

HealthRecord.prototype.getBMICategory = function() {
  const bmi = this.getBMI();
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

module.exports = HealthRecord;
