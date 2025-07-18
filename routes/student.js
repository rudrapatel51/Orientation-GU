const express = require('express');
const router = express.Router();
const { scanStudent, createStudent, getAllStudents } = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/student/scan - Main scanning endpoint
router.post('/scan', authenticateToken, scanStudent);

// POST /api/student/create - Create student (for testing)
router.post('/create', createStudent);

// GET /api/student/all - Get all students
router.get('/all', authenticateToken, getAllStudents);

module.exports = router;