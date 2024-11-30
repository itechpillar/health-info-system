class HealthRecord {
  constructor({
    id,
    studentId,
    date,
    height,
    weight,
    bloodPressure,
    temperature,
    notes,
    bmi,
    student = null
  }) {
    this.id = id;
    this.studentId = studentId;
    this.date = date;
    this.height = height;
    this.weight = weight;
    this.bloodPressure = bloodPressure;
    this.temperature = temperature;
    this.notes = notes;
    this.bmi = bmi;
    this.student = student;
  }

  static fromDatabase(data, student = null) {
    return new HealthRecord({
      id: data.id,
      studentId: data.studentId,
      date: data.date,
      height: data.height,
      weight: data.weight,
      bloodPressure: data.bloodPressure,
      temperature: data.temperature,
      notes: data.notes,
      bmi: data.bmi,
      student
    });
  }

  toJSON() {
    return {
      id: this.id,
      studentId: this.studentId,
      date: this.date,
      height: this.height,
      weight: this.weight,
      bloodPressure: this.bloodPressure,
      temperature: this.temperature,
      notes: this.notes,
      bmi: this.bmi,
      student: this.student
    };
  }

  // Helper methods
  isFollowUpRequired() {
    return this.nextCheckupDate && new Date(this.nextCheckupDate) > new Date();
  }

  getDaysSinceRecord() {
    const recordDate = new Date(this.date);
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
      date: this.date,
      diagnosis: this.diagnosis,
      treatment: this.treatment,
      followUpRequired: this.isFollowUpRequired(),
      daysUntilNextCheckup: this.getDaysUntilNextCheckup()
    };
  }
}

module.exports = HealthRecord;
