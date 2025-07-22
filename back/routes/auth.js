const express = require('express');
const router = express.Router();
const { login, createUser } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register (for testing)
router.post('/register', createUser);

module.exports = router;
