const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes
router.post('/scan', authenticateToken, studentController.scanStudent);
router.post('/create', studentController.createStudent);
router.get('/all', authenticateToken, studentController.getAllStudents);

module.exports = router;