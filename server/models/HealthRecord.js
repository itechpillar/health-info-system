const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const { HealthRecord: HealthRecordEntity } = require('./entities/HealthRecord');
const Student = require('./Student');

class HealthRecord extends Model {
  toEntity(student = null) {
    return HealthRecordEntity.fromDatabase(this.toJSON(), student);
  }

  calculateBMI() {
    if (!this.height || !this.weight) return null;
    
    // Convert height from cm to meters
    const heightInMeters = this.height / 100;
    // Calculate BMI: weight (kg) / (height (m))²
    const bmi = this.weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
  }

  toJSON() {
    const values = super.toJSON();
    values.bmi = this.calculateBMI();
    return values;
  }
}

HealthRecord.init({
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
    validate: {
      min: 0,
      max: 500 // Maximum weight in kg
    },
    comment: 'Weight in kilograms'
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 300 // Maximum height in cm
    },
    comment: 'Height in centimeters'
  },
  bloodPressure: {
    type: DataTypes.STRING,
    allowNull: true
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 30, // Minimum reasonable temperature in Celsius
      max: 45  // Maximum reasonable temperature in Celsius
    }
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
}, {
  sequelize,
  modelName: 'HealthRecord',
  tableName: 'HealthRecords',
  timestamps: true,
  hooks: {
    beforeValidate: (record) => {
      // Convert empty strings to null
      ['height', 'weight', 'temperature'].forEach(field => {
        if (record[field] === '') {
          record[field] = null;
        }
      });
    },
    beforeSave: (record) => {
      // Ensure numeric fields are stored as numbers
      ['height', 'weight', 'temperature'].forEach(field => {
        if (record[field] !== null) {
          record[field] = parseFloat(record[field]);
        }
      });
    }
  }
});

// Define association with Student
HealthRecord.associate = (models) => {
  HealthRecord.belongsTo(models.StudentModel, {
    foreignKey: 'studentId',
    targetKey: 'id',
    as: 'student'
  });
};

module.exports = HealthRecord;
