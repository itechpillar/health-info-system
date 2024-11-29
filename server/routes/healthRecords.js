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
 *             $ref: '#/components/schemas/HealthRecord'
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
