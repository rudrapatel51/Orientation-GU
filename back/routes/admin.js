const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');

// Admin login (public)
router.post('/login', adminController.adminLogin);

// Create admin user (protected, admin-only)
router.post('/create',  adminController.createAdmin);

// Get all students (protected, admin-only)
router.get('/students', authenticateToken, adminController.getAllStudents);

module.exports = router;