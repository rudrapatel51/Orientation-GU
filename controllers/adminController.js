const prisma = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user with admin privileges
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or not an admin'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      data: { token, name: user.name }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.studentData.findMany({
      orderBy: { scanTimestamp: 'desc' },
      select: {
        uuid: true,
        name: true,
        mobileno: true,
        enrollment: true,
        email: true,
        institute: true,
        status: true,
        scanTimestamp: true,
        userScan: true
      }
    });

    res.json({
      success: true,
      message: 'Students retrieved successfully',
      data: { students }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { adminLogin, getAllStudents };