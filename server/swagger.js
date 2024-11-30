const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Health Information System API',
      version: '1.0.0',
      description: 'API documentation for the Health Information System',
      contact: {
        name: 'API Support',
        email: 'support@healthinfosystem.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Student: {
          type: 'object',
          required: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'grade'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the student'
            },
            firstName: {
              type: 'string',
              description: 'First name of the student'
            },
            lastName: {
              type: 'string',
              description: 'Last name of the student'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth of the student'
            },
            gender: {
              type: 'string',
              description: 'Gender of the student'
            },
            grade: {
              type: 'integer',
              description: 'Student\'s grade level'
            },
            bloodType: {
              type: 'string',
              description: 'Blood type of the student'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the record was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the record was last updated'
            }
          }
        },
        HealthRecord: {
          type: 'object',
          required: ['studentId', 'recordDate', 'recordType'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the health record'
            },
            studentId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the student this record belongs to'
            },
            recordDate: {
              type: 'string',
              format: 'date',
              description: 'Date of the health record'
            },
            recordType: {
              type: 'string',
              description: 'Type of health record (e.g., checkup, vaccination)'
            },
            allergies: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of allergies'
            },
            medications: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of medications'
            },
            medicalConditions: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of medical conditions'
            },
            diagnosis: {
              type: 'string',
              description: 'Medical diagnosis'
            },
            treatment: {
              type: 'string',
              description: 'Treatment provided'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
            },
            nextCheckupDate: {
              type: 'string',
              format: 'date',
              description: 'Date for next checkup'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the record was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the record was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
