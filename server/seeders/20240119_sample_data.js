'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add sample students
    const students = await queryInterface.bulkInsert(
      'Students',
      [
        {
          id: uuidv4(),
          firstName: 'John',
          lastName: 'Smith',
          dateOfBirth: '2010-05-15',
          gender: 'male',
          studentId: 'ST001',
          grade: '8',
          contactNumber: '555-0101',
          email: 'john.smith@school.com',
          address: '123 Main St, Springfield, IL',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: 'Emma',
          lastName: 'Johnson',
          dateOfBirth: '2011-03-22',
          gender: 'female',
          studentId: 'ST002',
          grade: '7',
          contactNumber: '555-0102',
          email: 'emma.johnson@school.com',
          address: '456 Oak Ave, Springfield, IL',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: 'Michael',
          lastName: 'Davis',
          dateOfBirth: '2009-11-08',
          gender: 'male',
          studentId: 'ST003',
          grade: '9',
          contactNumber: '555-0103',
          email: 'michael.davis@school.com',
          address: '789 Pine Rd, Springfield, IL',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: 'Sophia',
          lastName: 'Wilson',
          dateOfBirth: '2010-09-30',
          gender: 'female',
          studentId: 'ST004',
          grade: '8',
          contactNumber: '555-0104',
          email: 'sophia.wilson@school.com',
          address: '321 Elm St, Springfield, IL',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: 'David',
          lastName: 'Brown',
          dateOfBirth: '2011-07-14',
          gender: 'male',
          studentId: 'ST005',
          grade: '7',
          contactNumber: '555-0105',
          email: 'david.brown@school.com',
          address: '654 Maple Dr, Springfield, IL',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: true }
    );

    // Add sample health records
    const healthRecords = [
      {
        id: uuidv4(),
        studentId: 'ST001',
        recordType: 'Annual Physical',
        recordDate: '2024-01-15',
        weight: 52.5,
        height: 162,
        bloodPressure: '110/70',
        temperature: 36.6,
        medicalNotes: 'Regular checkup. All vitals normal.',
        medications: 'None',
        allergies: 'Pollen',
        treatmentPlan: 'No treatment needed',
        nextAppointment: '2025-01-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        studentId: 'ST002',
        recordType: 'Vaccination',
        recordDate: '2024-01-10',
        weight: 48.0,
        height: 158,
        bloodPressure: '108/68',
        temperature: 36.7,
        medicalNotes: 'Seasonal flu vaccination administered',
        medications: 'None',
        allergies: 'None',
        treatmentPlan: 'Next vaccination due in 12 months',
        nextAppointment: '2025-01-10',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        studentId: 'ST003',
        recordType: 'Sports Physical',
        recordDate: '2024-01-08',
        weight: 58.5,
        height: 170,
        bloodPressure: '112/72',
        temperature: 36.5,
        medicalNotes: 'Cleared for all sports activities',
        medications: 'None',
        allergies: 'None',
        treatmentPlan: 'Regular exercise recommended',
        nextAppointment: '2024-08-08',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        studentId: 'ST004',
        recordType: 'Annual Physical',
        recordDate: '2024-01-12',
        weight: 50.0,
        height: 160,
        bloodPressure: '106/68',
        temperature: 36.8,
        medicalNotes: 'Regular checkup. Mild seasonal allergies.',
        medications: 'Cetirizine 10mg',
        allergies: 'Dust, Pet dander',
        treatmentPlan: 'Continue antihistamine during allergy season',
        nextAppointment: '2025-01-12',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        studentId: 'ST005',
        recordType: 'Dental Checkup',
        recordDate: '2024-01-05',
        weight: 45.5,
        height: 155,
        bloodPressure: '105/65',
        temperature: 36.6,
        medicalNotes: 'Regular dental cleaning and checkup',
        medications: 'None',
        allergies: 'None',
        treatmentPlan: 'Continue regular brushing and flossing',
        nextAppointment: '2024-07-05',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('HealthRecords', healthRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('HealthRecords', null, {});
    await queryInterface.bulkDelete('Students', null, {});
  }
};
