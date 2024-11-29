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
          required: ['studentId', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'grade'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the student'
            },
            studentId: {
              type: 'string',
              description: 'Student\'s school ID number'
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
            }
          }
        },
        HealthRecord: {
          type: 'object',
          required: ['studentId', 'recordDate', 'recordType'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the health record'
            },
            studentId: {
              type: 'integer',
              description: 'ID of the student this record belongs to'
            },
            recordDate: {
              type: 'string',
              format: 'date',
              description: 'Date of the health record'
            },
            recordType: {
              type: 'string',
              description: 'Type of health record'
            },
            condition: {
              type: 'string',
              description: 'Health condition'
            },
            treatment: {
              type: 'string',
              description: 'Treatment provided'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
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
