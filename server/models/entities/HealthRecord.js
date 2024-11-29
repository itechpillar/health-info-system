class HealthRecord {
  constructor({
    id,
    studentId,
    recordDate,
    recordType,
    allergies,
    medications,
    medicalConditions,
    diagnosis,
    treatment,
    notes,
    nextCheckupDate,
    createdAt,
    updatedAt,
    student = null
  }) {
    this.id = id;
    this.studentId = studentId;
    this.recordDate = recordDate;
    this.recordType = recordType;
    this.allergies = allergies;
    this.medications = medications;
    this.medicalConditions = medicalConditions;
    this.diagnosis = diagnosis;
    this.treatment = treatment;
    this.notes = notes;
    this.nextCheckupDate = nextCheckupDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.student = student;
  }

  static fromDatabase(dbRecord, student = null) {
    return new HealthRecord({
      ...dbRecord,
      student: student ? {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName
      } : null
    });
  }

  toJSON() {
    return {
      id: this.id,
      studentId: this.studentId,
      recordDate: this.recordDate,
      recordType: this.recordType,
      allergies: this.allergies,
      medications: this.medications,
      medicalConditions: this.medicalConditions,
      diagnosis: this.diagnosis,
      treatment: this.treatment,
      notes: this.notes,
      nextCheckupDate: this.nextCheckupDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      student: this.student
    };
  }

  // Helper methods
  isFollowUpRequired() {
    return this.nextCheckupDate && new Date(this.nextCheckupDate) > new Date();
  }

  getDaysSinceRecord() {
    const recordDate = new Date(this.recordDate);
    const today = new Date();
    const diffTime = Math.abs(today - recordDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysUntilNextCheckup() {
    if (!this.nextCheckupDate) return null;
    const checkupDate = new Date(this.nextCheckupDate);
    const today = new Date();
    const diffTime = checkupDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getRecordSummary() {
    return {
      date: this.recordDate,
      type: this.recordType,
      diagnosis: this.diagnosis,
      treatment: this.treatment,
      followUpRequired: this.isFollowUpRequired(),
      daysUntilNextCheckup: this.getDaysUntilNextCheckup()
    };
  }
}

module.exports = HealthRecord;
