const prisma = require('../config/database');

const scanStudent = async (req, res) => {
  try {
    const { uuid } = req.body;
    // Fallbacks for unauthenticated requests
    const userName = req.user ? req.user.name : 'Anonymous';

    // Validate input
    if (!uuid) {
      console.log('No UUID provided in request body');
      return res.status(400).json({
        success: false,
        message: 'UUID is required',
      });
    }

    // Log incoming UUID for debugging
    console.log('Received UUID:', uuid);

    // Check if student exists
    const student = await prisma.studentData.findUnique({
      where: { uuid },
    });

    if (!student) {
      console.log('Student not found for UUID:', uuid);
      // Query all UUIDs to verify database contents (for debugging)
      const allStudents = await prisma.studentData.findMany({
        select: { uuid: true },
      });
      console.log('All UUIDs in database:', allStudents.map(s => s.uuid));
      return res.status(404).json({
        success: false,
        message: `Student not found for UUID: ${uuid}`,
      });
    }

    // Log found student details
    console.log('Found student:', {
      uuid: student.uuid,
      name: student.name,
      status: student.status,
      transportation_availability: student.transportation_availability,
    });

    // Handle scanning based on transportation availability
    if (student.transportation_availability !== 'UNIVERSITY TRANSPORTATION') {
      // For non-university transportation, handle two-step scanning
      if (student.status === 'pending') {
        // First scan: mark as vehicle_allowed
        const updatedStudent = await prisma.studentData.update({
          where: { uuid },
          data: {
            status: 'vehicle_allowed',
            scanTimestamp: new Date(),
            userScan: userName,
          },
        });

        console.log('Updated student to vehicle_allowed:', {
          uuid: updatedStudent.uuid,
          status: updatedStudent.status,
        });

        return res.json({
          success: true,
          message: 'You are allowed with your vehicle',
          data: {
            student: {
              uuid: updatedStudent.uuid,
              name: updatedStudent.name,
              status: updatedStudent.status,
              scanTimestamp: updatedStudent.scanTimestamp,
              userScan: updatedStudent.userScan,
            },
          },
        });
      } else if (student.status === 'vehicle_allowed') {
        // Second scan: mark as present
        const updatedStudent = await prisma.studentData.update({
          where: { uuid },
          data: {
            status: 'present',
            scanTimestamp: new Date(),
            userScan: userName,
          },
        });

        console.log('Updated student to present:', {
          uuid: updatedStudent.uuid,
          status: updatedStudent.status,
        });

        return res.json({
          success: true,
          message: 'Student marked as present successfully',
          data: {
            student: {
              uuid: updatedStudent.uuid,
              name: updatedStudent.name,
              status: updatedStudent.status,
              scanTimestamp: updatedStudent.scanTimestamp,
              userScan: updatedStudent.userScan,
            },
          },
        });
      } else if (student.status === 'present') {
        // Already fully scanned
        console.log('Student already marked present:', {
          uuid: student.uuid,
          status: student.status,
        });
        return res.status(409).json({
          success: false,
          message: 'User already exists (already marked present)',
          data: {
            student: {
              uuid: student.uuid,
              name: student.name,
              status: student.status,
              scanTimestamp: student.scanTimestamp,
              userScan: student.userScan,
            },
          },
        });
      }
    } else {
      // For university transportation, single scan to present
      if (student.status === 'present') {
        console.log('Student already marked present:', {
          uuid: student.uuid,
          status: student.status,
        });
        return res.status(409).json({
          success: false,
          message: 'User already exists (already marked present)',
          data: {
            student: {
              uuid: student.uuid,
              name: student.name,
              status: student.status,
              scanTimestamp: student.scanTimestamp,
              userScan: student.userScan,
            },
          },
        });
      }

      // Update student status to present
      const updatedStudent = await prisma.studentData.update({
        where: { uuid },
        data: {
          status: 'present',
          scanTimestamp: new Date(),
          userScan: userName,
        },
      });

      console.log('Updated student to present:', {
        uuid: updatedStudent.uuid,
        status: updatedStudent.status,
      });

      return res.json({
        success: true,
        message: 'Student marked as present successfully',
        data: {
          student: {
            uuid: updatedStudent.uuid,
            name: updatedStudent.name,
            status: updatedStudent.status,
            scanTimestamp: updatedStudent.scanTimestamp,
            userScan: updatedStudent.userScan,
          },
        },
      });
    }
  } catch (error) {
    console.error('Scan student error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Helper function to create a student (for testing)
const createStudent = async (req, res) => {
  try {
    const { uuid, name, mobileno, enrollment, email, institute, transportation_availability } = req.body;

    // Validate input, including uuid
    if (!uuid || !name || !mobileno || !enrollment || !email || !institute || !transportation_availability) {
      console.log('Missing required fields:', req.body);
      return res.status(400).json({
        success: false,
        message: 'All fields are required, including UUID and transportation_availability',
      });
    }

    const student = await prisma.studentData.create({
      data: {
        uuid,
        name,
        mobileno,
        enrollment,
        email,
        institute,
        transportation_availability,
      },
    });

    console.log('Created student:', {
      uuid: student.uuid,
      name: student.name,
      enrollment: student.enrollment,
      email: student.email,
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { student },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Duplicate entry error:', error.meta);
      return res.status(409).json({
        success: false,
        message: 'Student with this UUID, enrollment, or email already exists',
      });
    }

    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.studentData.findMany({
      orderBy: { scanTimestamp: 'desc' },
    });

    console.log('Retrieved students count:', students.length);

    res.json({
      success: true,
      data: { students },
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = { scanStudent, createStudent, getAllStudents };