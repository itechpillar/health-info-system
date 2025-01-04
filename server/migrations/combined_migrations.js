'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Create Students table
    await queryInterface.createTable('Students', {
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
      },
      fatherName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      motherName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create HealthRecords table
    await queryInterface.createTable('HealthRecords', {
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
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('HealthRecords', ['recordDate'], {
      name: 'health_records_record_date'
    });
  },

  down: async (queryInterface, DataTypes) => {
    // Remove index
    try {
      await queryInterface.removeIndex('HealthRecords', 'health_records_record_date');
    } catch (error) {
      console.log('Index might not exist:', error.message);
    }

    // Drop tables in reverse order
    await queryInterface.dropTable('HealthRecords');
    await queryInterface.dropTable('Students');
  }
};
