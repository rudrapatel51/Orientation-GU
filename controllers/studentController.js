const prisma = require('../config/database');

const scanStudent = async (req, res) => {
  try {
    const { uuid } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    // Validate input
    if (!uuid) {
      return res.status(400).json({
        success: false,
        message: 'UUID is required'
      });
    }

    // Check if student exists
    const student = await prisma.studentData.findUnique({
      where: { uuid }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check current status
    if (student.status === 'present') {
      return res.status(409).json({
        success: false,
        message: 'User already exists (already marked present)',
        data: {
          student: {
            uuid: student.uuid,
            name: student.name,
            status: student.status,
            scanTimestamp: student.scanTimestamp,
            userScan: student.userScan
          }
        }
      });
    }

    // Update student status to present
    const updatedStudent = await prisma.studentData.update({
      where: { uuid },
      data: {
        status: 'present',
        scanTimestamp: new Date(),
        userScan: userName
      }
    });

    res.json({
      success: true,
      message: 'Student marked as present successfully',
      data: {
        student: {
          uuid: updatedStudent.uuid,
          name: updatedStudent.name,
          status: updatedStudent.status,
          scanTimestamp: updatedStudent.scanTimestamp,
          userScan: updatedStudent.userScan
        }
      }
    });

  } catch (error) {
    console.error('Scan student error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to create a student (for testing)
const createStudent = async (req, res) => {
  try {
    const { uuid, name, mobileno, enrollment, email, institute } = req.body;

    // Validate input, including uuid
    if (!uuid || !name || !mobileno || !enrollment || !email || !institute) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required, including UUID'
      });
    }

    const student = await prisma.studentData.create({
      data: {
        uuid, // Explicitly use the UUID provided by the frontend
        name,
        mobileno,
        enrollment,
        email,
        institute
      }
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { student }
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Student with this UUID, enrollment, or email already exists'
      });
    }
    
    console.error('Create student error:', error);
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
      orderBy: { scanTimestamp: 'desc' }
    });

    res.json({
      success: true,
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

module.exports = { scanStudent, createStudent, getAllStudents };