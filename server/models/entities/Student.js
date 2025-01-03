const HealthRecord = require('./HealthRecord');

class Student {
  constructor({
    id,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    grade,
    bloodType,
    fatherName,
    createdAt,
    updatedAt,
    healthRecords = []
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.grade = grade;
    this.bloodType = bloodType;
    this.fatherName = fatherName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.healthRecords = healthRecords;
  }

  static fromDatabase(dbStudent, healthRecords = []) {
    return new Student({
      ...dbStudent,
      healthRecords: healthRecords.map(record => HealthRecord.fromDatabase(record))
    });
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      grade: this.grade,
      bloodType: this.bloodType,
      fatherName: this.fatherName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      healthRecords: this.healthRecords.map(record => record.toJSON())
    };
  }

  // Helper methods
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getAge() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getLatestHealthRecord() {
    if (!this.healthRecords.length) return null;
    return this.healthRecords.sort((a, b) => 
      new Date(b.recordDate) - new Date(a.recordDate)
    )[0];
  }
}

module.exports = Student;
