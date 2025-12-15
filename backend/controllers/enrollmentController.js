const pool = require('../config/database');
const { fetchExternal, fetchInternal } = require('../utils/apiClient');
const { pushNotification, notifyAdmins } = require('../utils/notificationService');

// Flip to true locally if you need the verbose enrollment logs again.
const enrollmentDebugLogsEnabled = false;

// Validation functions
const validateStudentExists = async (studentId) => {
  try {
    const result = await pool.query('SELECT id, full_name FROM students WHERE id = $1', [studentId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error validating student:', error);
    return null;
  }
};

const validateCourseExists = async (courseId) => {
  try {
    const result = await pool.query('SELECT id, title FROM courses WHERE id = $1', [courseId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error validating course:', error);
    return null;
  }
};

const checkDuplicateEnrollment = async (studentId, courseId) => {
  try {
    const result = await pool.query(
      'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, courseId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking duplicate enrollment:', error);
    return false;
  }
};

// Database operations
const createEnrollment = async (studentId, courseId, status = 'active', options = {}) => {
  if (enrollmentDebugLogsEnabled) {
    console.log('Creating enrollment:', { studentId, courseId, status });
  }

  const client = await pool.connect();
  const { io = null, actorRole = 'system', actorId = null } = options || {};

  try {
    await client.query('BEGIN');

    if (enrollmentDebugLogsEnabled) {
      console.log('Validating student exists:', studentId);
    }
    const student = await validateStudentExists(studentId);
    if (enrollmentDebugLogsEnabled) {
      console.log('Student exists:', Boolean(student));
    }
    if (!student) {
      throw new Error('Student not found');
    }

    if (enrollmentDebugLogsEnabled) {
      console.log('Validating course exists:', courseId);
    }
    const course = await validateCourseExists(courseId);
    if (enrollmentDebugLogsEnabled) {
      console.log('Course exists:', Boolean(course));
    }
    if (!course) {
      throw new Error('Course not found');
    }

    if (enrollmentDebugLogsEnabled) {
      console.log('Checking for duplicate enrollment');
    }
    const isDuplicate = await checkDuplicateEnrollment(studentId, courseId);
    if (enrollmentDebugLogsEnabled) {
      console.log('Is duplicate:', isDuplicate);
    }
    if (isDuplicate) {
      throw new Error('Student already enrolled in this course');
    }

    if (enrollmentDebugLogsEnabled) {
      console.log('Creating enrollment record');
    }
    const result = await client.query(
      `INSERT INTO enrollments (student_id, course_id, status, enrolled_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [studentId, courseId, status]
    );

    const enrollment = result.rows[0];
    if (enrollmentDebugLogsEnabled) {
      console.log('Enrollment record created:', enrollment);
    }

    await client.query('COMMIT');

    const courseTitle = course.title || 'your course';

    try {
      await pushNotification({
        role: 'student',
        recipientRole: 'student',
        recipientId: student.id,
        type: 'course_enrollment',
        title: `Enrolled in ${courseTitle}`,
        message: `You're now enrolled in ${courseTitle}. Check your dashboard for course materials.`,
        metadata: {
          enrollmentId: enrollment.id,
          studentId: student.id,
          courseId: course.id,
          courseTitle,
        },
        io,
      });
    } catch (studentNotificationError) {
      console.error('Enrollment notification error (student):', studentNotificationError);
    }

    try {
      await notifyAdmins({
        title: 'New course enrollment',
        message: `${student.full_name || 'A student'} enrolled in ${courseTitle}.`,
        type: 'course_enrollment',
        metadata: {
          enrollmentId: enrollment.id,
          studentId: student.id,
          courseId: course.id,
          actorRole,
          actorId,
        },
        io,
      });
    } catch (adminNotificationError) {
      console.error('Enrollment notification error (admin):', adminNotificationError);
    }

    return enrollment;
  } catch (error) {
    if (enrollmentDebugLogsEnabled) {
      console.error('Error in createEnrollment:', error);
    }
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Enrollment lookup functions
const getEnrollmentsByStudentId = async (studentId) => {
  try {
    const result = await pool.query(
      `SELECT e.*, c.title as course_name, c.description 
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.id 
       WHERE e.student_id = $1 
       ORDER BY e.enrolled_at DESC`,
      [studentId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting enrollments by student:', error);
    throw error;
  }
};

const getEnrollmentsByCourseId = async (courseId) => {
  try {
    const result = await pool.query(
      `SELECT e.*, s.full_name as student_name, s.email as student_email 
       FROM enrollments e 
       JOIN students s ON e.student_id = s.id 
       WHERE e.course_id = $1 
       ORDER BY e.enrolled_at DESC`,
      [courseId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting enrollments by course:', error);
    throw error;
  }
};

const isStudentEnrolledInCourse = async (studentId, courseId) => {
  try {
    const result = await pool.query(
      'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2 AND status = $3',
      [studentId, courseId, 'active']
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return false;
  }
};

module.exports = {
  validateStudentExists,
  validateCourseExists,
  checkDuplicateEnrollment,
  createEnrollment,
  getEnrollmentsByStudentId,
  getEnrollmentsByCourseId,
  isStudentEnrolledInCourse
};