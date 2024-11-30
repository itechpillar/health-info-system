const Student = require('../models/Student');
const HealthRecord = require('../models/HealthRecord');

// Create a new Student
exports.create = async (req, res) => {
  try {
    const studentData = { ...req.body };
    
    // Ensure proper casing for gender
    if (studentData.gender) {
      const normalizedGender = studentData.gender.charAt(0).toUpperCase() + studentData.gender.slice(1).toLowerCase();
      if (!['Male', 'Female', 'Other'].includes(normalizedGender)) {
        return res.status(400).json({ error: "Gender must be either 'Male', 'Female', or 'Other'" });
      }
      studentData.gender = normalizedGender;
    }

    // Validate required fields
    if (!studentData.firstName || !studentData.lastName || !studentData.dateOfBirth || !studentData.gender || !studentData.grade) {
      return res.status(400).json({
        message: 'Required fields missing',
        required: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'grade']
      });
    }

    const student = await Student.create(studentData);

    // Convert to entity before sending response
    const studentEntity = student.toEntity();
    res.status(201).json(studentEntity);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

// Get all students
exports.findAll = async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [['firstName', 'ASC'], ['lastName', 'ASC']]
    });
    res.json(students);
  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
};

// Find a single student
exports.findOne = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Error retrieving student', error: error.message });
  }
};

// Update a student
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Ensure proper casing for gender
    if (updateData.gender) {
      const normalizedGender = updateData.gender.charAt(0).toUpperCase() + updateData.gender.slice(1).toLowerCase();
      if (!['Male', 'Female', 'Other'].includes(normalizedGender)) {
        return res.status(400).json({ error: "Gender must be either 'Male', 'Female', or 'Other'" });
      }
      updateData.gender = normalizedGender;
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update(updateData);

    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

// Get student's health records
exports.getStudentHealthRecords = async (req, res) => {
  try {
    console.log('Searching for student with ID:', req.params.id);
    const student = await Student.findByPk(req.params.id);
    
    if (!student) {
      console.log('Student not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Found student:', student.firstName, student.lastName);
    console.log('Searching for health records with studentId:', student.id);
    
    const healthRecords = await HealthRecord.findAll({
      where: { studentId: student.id },
      order: [['recordDate', 'DESC']]
    });
    
    console.log('Found health records:', healthRecords.length);
    res.json(healthRecords);
  } catch (error) {
    console.error('Error retrieving health records:', error);
    res.status(500).json({ message: 'Error retrieving health records', error: error.message });
  }
};

module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  findOne: exports.findOne,
  update: exports.update,
  deleteStudent: exports.deleteStudent,
  getStudentHealthRecords: exports.getStudentHealthRecords
};
