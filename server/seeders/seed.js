const { sequelize, Student, HealthRecord } = require('../models');
const { v4: uuidv4 } = require('uuid');

const seedData = async () => {
  try {
    // Generate UUIDs for students
    const studentUUIDs = {
      student1: uuidv4(),
      student2: uuidv4(),
      student3: uuidv4()
    };

    // Sample students
    const students = [
      {
        id: studentUUIDs.student1,
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-05-15',
        gender: 'Male',
        grade: 5
      },
      {
        id: studentUUIDs.student2,
        studentId: 'STU002',
        firstName: 'Alice',
        lastName: 'Smith',
        dateOfBirth: '2011-03-20',
        gender: 'Female',
        grade: 4
      },
      {
        id: studentUUIDs.student3,
        studentId: 'STU003',
        firstName: 'Michael',
        lastName: 'Johnson',
        dateOfBirth: '2010-08-10',
        gender: 'Male',
        grade: 5
      }
    ];

    // Create students
    const createdStudents = await Student.bulkCreate(students);

    // Sample health records
    const healthRecords = [
      {
        id: uuidv4(),
        studentId: studentUUIDs.student1,
        recordDate: '2024-01-15',
        recordType: 'Regular Checkup',
        height: 145.5,
        weight: 40.2,
        bloodPressure: '110/70',
        temperature: 36.6,
        allergies: ['Peanuts'],
        medications: ['None'],
        medicalNotes: 'Healthy child, regular development',
        treatmentPlan: 'Continue regular checkups',
        nextAppointment: '2024-07-15'
      },
      {
        id: uuidv4(),
        studentId: studentUUIDs.student2,
        recordDate: '2024-01-16',
        recordType: 'Regular Checkup',
        height: 138.2,
        weight: 35.5,
        bloodPressure: '108/68',
        temperature: 36.7,
        allergies: ['None'],
        medications: ['Cold medicine'],
        medicalNotes: 'Mild cold symptoms present, asthma well controlled',
        treatmentPlan: 'Monitor cold symptoms, continue asthma medication',
        nextAppointment: '2024-07-16'
      },
      {
        id: uuidv4(),
        studentId: studentUUIDs.student3,
        recordDate: '2024-01-17',
        recordType: 'Regular Checkup',
        height: 142.8,
        weight: 38.4,
        bloodPressure: '112/72',
        temperature: 36.5,
        allergies: ['Dust'],
        medications: ['Allergy medication'],
        medicalNotes: 'Healthy child, seasonal allergies well managed',
        treatmentPlan: 'Continue allergy medication as needed',
        nextAppointment: '2024-07-17'
      }
    ];

    // Create health records
    await HealthRecord.bulkCreate(healthRecords);

    console.log('Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

module.exports = seedData;
