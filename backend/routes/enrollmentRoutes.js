const express = require('express');
const { 
  createEnrollment, 
  getEnrollmentsByStudentId, 
  getEnrollmentsByCourseId,
  isStudentEnrolledInCourse 
} = require('../controllers/enrollmentController');

const router = express.Router();

// POST /api/enrollments - Create new enrollment
router.post('/', async (req, res) => {
  const { student_id, course_id, status } = req.body;

  // Validate required fields
  if (!student_id || !course_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID and Course ID are required' 
    });
  }

  try {
    const enrollment = await createEnrollment(student_id, course_id, status, {
      io: req.app?.get('io'),
      actorRole: req.user?.role || 'enrollment_api',
      actorId: req.user?.id || null,
    });
    res.status(201).json({ 
      success: true, 
      message: 'Enrollment created successfully',
      data: enrollment 
    });
  } catch (error) {
    console.error('Enrollment creation error:', error);
    
    if (error.message === 'Student not found') {
      return res.status(400).json({ success: false, message: 'Student not found' });
    }
    
    if (error.message === 'Course not found') {
      return res.status(400).json({ success: false, message: 'Course not found' });
    }
    
    if (error.message === 'Student already enrolled in this course') {
      return res.status(409).json({ success: false, message: 'Student already enrolled in this course' });
    }
    
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /api/enrollments/student/:studentId - Get enrollments by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const enrollments = await getEnrollmentsByStudentId(req.params.studentId);
    res.json({ success: true, data: enrollments });
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /api/enrollments/course/:courseId - Get enrollments by course
router.get('/course/:courseId', async (req, res) => {
  try {
    const enrollments = await getEnrollmentsByCourseId(req.params.courseId);
    res.json({ success: true, data: enrollments });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /api/enrollments/check/:studentId/:courseId - Check if student is enrolled
router.get('/check/:studentId/:courseId', async (req, res) => {
  try {
    const isEnrolled = await isStudentEnrolledInCourse(req.params.studentId, req.params.courseId);
    res.json({ success: true, enrolled: isEnrolled });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// POST /api/enrollments/enroll - Enroll authenticated student in course
router.post('/enroll', async (req, res) => {
  const { course_id } = req.body;
  
  // Get student_id from authenticated user (you may need to adjust this based on your auth system)
  const student_id = req.user?.id || req.body.student_id;

  if (!student_id || !course_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID and Course ID are required' 
    });
  }

  try {
    const enrollment = await createEnrollment(student_id, course_id, 'active', {
      io: req.app?.get('io'),
      actorRole: req.user?.role || 'student',
      actorId: req.user?.id || student_id,
    });
    res.status(201).json({ 
      success: true, 
      message: 'Successfully enrolled in course',
      data: enrollment 
    });
  } catch (error) {
    console.error('Enrollment creation error:', error);
    
    if (error.message === 'Student not found') {
      return res.status(400).json({ success: false, message: 'Student not found' });
    }
    
    if (error.message === 'Course not found') {
      return res.status(400).json({ success: false, message: 'Course not found' });
    }
    
    if (error.message === 'Student already enrolled in this course') {
      return res.status(409).json({ success: false, message: 'Already enrolled in this course' });
    }
    
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = router;