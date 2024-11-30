const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');

/**
 * @swagger
 * /api/health-records:
 *   get:
 *     summary: Get all health records
 *     tags: [Health Records]
 *     responses:
 *       200:
 *         description: List of health records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthRecord'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', healthRecordController.findAll);

/**
 * @swagger
 * /api/health-records/student/{studentId}:
 *   get:
 *     summary: Get all health records for a student
 *     tags: [Health Records]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: List of health records for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthRecord'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get('/student/:studentId', healthRecordController.findAllByStudent);

/**
 * @swagger
 * /api/health-records/{id}:
 *   get:
 *     summary: Get a health record by ID
 *     tags: [Health Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Health Record ID
 *     responses:
 *       200:
 *         description: Health record found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthRecord'
 *       404:
 *         description: Health record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', healthRecordController.findOne);

/**
 * @swagger
 * /api/health-records:
 *   post:
 *     summary: Create a new health record
 *     tags: [Health Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - recordDate
 *               - recordType
 *             properties:
 *               studentId:
 *                 type: integer
 *                 description: ID of the student this record belongs to
 *               recordDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the health record
 *               recordType:
 *                 type: string
 *                 description: Type of health record
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: Weight in kilograms
 *               height:
 *                 type: number
 *                 format: float
 *                 description: Height in centimeters
 *               bloodPressure:
 *                 type: string
 *                 description: Blood pressure reading
 *               temperature:
 *                 type: number
 *                 format: float
 *                 description: Body temperature
 *               allergies:
 *                 type: string
 *                 description: Allergies information
 *               medications:
 *                 type: string
 *                 description: Current medications
 *               medicalNotes:
 *                 type: string
 *                 description: Medical notes
 *               treatmentPlan:
 *                 type: string
 *                 description: Treatment plan details
 *               nextAppointment:
 *                 type: string
 *                 format: date
 *                 description: Next appointment date
 *     responses:
 *       201:
 *         description: Health record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthRecord'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', healthRecordController.create);

/**
 * @swagger
 * /api/health-records/{id}:
 *   put:
 *     summary: Update a health record
 *     tags: [Health Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Health Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthRecord'
 *     responses:
 *       200:
 *         description: Health record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthRecord'
 *       404:
 *         description: Health record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', healthRecordController.update);

/**
 * @swagger
 * /api/health-records/{id}:
 *   delete:
 *     summary: Delete a health record
 *     tags: [Health Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Health Record ID
 *     responses:
 *       200:
 *         description: Health record deleted successfully
 *       404:
 *         description: Health record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', healthRecordController.delete);

module.exports = router;
