const { HealthRecord, StudentModel } = require('../models');

const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI using weight in kg and height in meters
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Round to 1 decimal place
  return Math.round(bmi * 10) / 10;
};

const formatRecord = (record) => {
  if (!record) return null;
  const plainRecord = record.get({ plain: true });
  const { id, student, ...recordData } = plainRecord;
  
  // Calculate BMI only if both weight and height are present
  const bmi = calculateBMI(recordData.weight, recordData.height);
  
  return { 
    id,
    ...recordData,
    bmi: bmi || null  // Return null if BMI couldn't be calculated
  };
};

const healthRecordController = {
  // Create a new health record
  create: async (req, res) => {
    try {
      const { studentId, height, weight, ...otherData } = req.body;

      // Check if student exists
      const student = await StudentModel.findByPk(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Create health record
      const healthRecord = await HealthRecord.create({
        studentId,
        height: parseFloat(height),
        weight: parseFloat(weight),
        ...otherData
      });

      res.status(201).json(healthRecord);
    } catch (error) {
      console.error('Error creating health record:', error);
      res.status(400).json({ 
        message: 'Failed to create health record',
        error: error.message 
      });
    }
  },

  // Get all health records
  findAll: async (req, res) => {
    try {
      console.log('Attempting to fetch all health records...');
      const healthRecords = await HealthRecord.findAll({
        order: [['date', 'DESC']]
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
      const { studentId } = req.params;
      console.log('Fetching health records for student:', studentId);
      
      // Check if student exists
      const student = await StudentModel.findByPk(studentId);
      if (!student) {
        console.log('Student not found:', studentId);
        return res.status(404).json({ message: 'Student not found' });
      }

      // Get health records
      const healthRecords = await HealthRecord.findAll({
        where: { studentId },
        order: [['recordDate', 'DESC']],
        raw: false
      });

      console.log('Found health records:', healthRecords.length);
      
      // Map records and explicitly calculate BMI
      const response = healthRecords.map(record => {
        const height = parseFloat(record.height);
        const weight = parseFloat(record.weight);
        let bmi = null;
        
        if (height && weight) {
          const heightInMeters = height / 100;
          bmi = weight / (heightInMeters * heightInMeters);
          bmi = Math.round(bmi * 10) / 10; // Round to 1 decimal place
        }
        
        console.log('Record:', {
          id: record.id,
          height,
          weight,
          calculatedBMI: bmi
        });
        
        return {
          id: record.id,
          studentId: record.studentId,
          recordDate: record.recordDate,
          recordType: record.recordType,
          height,
          weight,
          bloodPressure: record.bloodPressure,
          temperature: record.temperature,
          allergies: record.allergies,
          medications: record.medications,
          medicalNotes: record.medicalNotes,
          treatmentPlan: record.treatmentPlan,
          nextAppointment: record.nextAppointment,
          bmi
        };
      });

      console.log('Sending response with first record:', response[0]);
      res.json(response);
    } catch (error) {
      console.error('Error fetching health records:', error);
      res.status(500).json({ 
        message: 'Failed to fetch health records',
        error: error.message 
      });
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
      const { id } = req.params;
      const { height, weight, ...otherData } = req.body;

      // Find the record
      const healthRecord = await HealthRecord.findByPk(id);
      if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
      }

      // Update the record
      await healthRecord.update({
        height: height ? parseFloat(height) : healthRecord.height,
        weight: weight ? parseFloat(weight) : healthRecord.weight,
        ...otherData
      });

      // Fetch the updated record to get the calculated BMI
      const updatedRecord = await HealthRecord.findByPk(id);
      res.json(updatedRecord);
    } catch (error) {
      console.error('Error updating health record:', error);
      res.status(400).json({ 
        message: 'Failed to update health record',
        error: error.message 
      });
    }
  },

  // Delete a health record
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const healthRecord = await HealthRecord.findByPk(id);
      if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
      }

      await healthRecord.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting health record:', error);
      res.status(500).json({ 
        message: 'Failed to delete health record',
        error: error.message 
      });
    }
  }
};

module.exports = healthRecordController;
