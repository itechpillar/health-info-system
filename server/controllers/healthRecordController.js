const { HealthRecord, StudentModel } = require('../models');

const formatRecord = (record) => {
  if (!record) return null;
  const plainRecord = record.get({ plain: true });
  const { id, student, ...recordData } = plainRecord;
  return recordData;
};

const healthRecordController = {
  // Create a new health record
  create: async (req, res) => {
    try {
      // Check if student exists
      const student = await StudentModel.findByPk(req.body.studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const healthRecord = await HealthRecord.create({
        ...req.body,
        studentId: req.body.studentId
      });
      
      res.status(201).json(formatRecord(healthRecord));
    } catch (error) {
      console.error('Create health record error:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Get all health records
  findAll: async (req, res) => {
    try {
      console.log('Attempting to fetch all health records...');
      const healthRecords = await HealthRecord.findAll({
        order: [['recordDate', 'DESC']]
      });
      console.log('Successfully fetched health records:', healthRecords.length);
      res.json(healthRecords.map(formatRecord));
    } catch (error) {
      console.error('Find health records error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      });
    }
  },

  // Get all health records for a specific student
  findAllByStudent: async (req, res) => {
    try {
      const student = await StudentModel.findByPk(req.params.studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const healthRecords = await HealthRecord.findAll({
        where: { studentId: req.params.studentId },
        order: [['recordDate', 'DESC']]
      });

      res.json(healthRecords.map(formatRecord));
    } catch (error) {
      console.error('Find student health records error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single health record
  findOne: async (req, res) => {
    try {
      const healthRecord = await HealthRecord.findByPk(req.params.id);
      if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
      }
      res.json(formatRecord(healthRecord));
    } catch (error) {
      console.error('Find health record error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update a health record
  update: async (req, res) => {
    try {
      const healthRecord = await HealthRecord.findByPk(req.params.id);
      if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
      }

      // If studentId is being updated, check if new student exists
      if (req.body.studentId && req.body.studentId !== healthRecord.studentId) {
        const student = await StudentModel.findByPk(req.body.studentId);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
      }

      await healthRecord.update(req.body);
      res.json(formatRecord(healthRecord));
    } catch (error) {
      console.error('Update health record error:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a health record
  delete: async (req, res) => {
    try {
      const healthRecord = await HealthRecord.findByPk(req.params.id);
      if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
      }
      await healthRecord.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Delete health record error:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = healthRecordController;
