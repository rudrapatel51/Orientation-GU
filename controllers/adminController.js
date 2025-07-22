const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, isAdmin) => {
  return jwt.sign(
    { userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate input
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name and password are required'
      });
    }

    // Find user with admin privileges
    const user = await prisma.user.findUnique({
      where: { name }
    });

    if (!user || !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or not an admin'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.isAdmin);

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create admin user
const createAdmin = async (req, res) => {
  try {
    const { name, password, username } = req.body;

    // Validate input
    if (!name || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Name, password, and username are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { name }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        username,
        isAdmin: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
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

module.exports = { adminLogin, createAdmin, getAllStudents };