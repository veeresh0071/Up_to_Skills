const express = require('express');
const pool = require('../config/database');
const { createEnrollment } = require('../controllers/enrollmentController');

const router = express.Router();

// Test endpoint to manually create an enrollment
router.post('/test-enrollment', async (req, res) => {
  try {
    console.log('=== TESTING ENROLLMENT ===');
    
    // Check if tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('enrollments', 'courses', 'students')
    `);
    console.log('Available tables:', tablesCheck.rows);
    
    // Check courses
    const courses = await pool.query('SELECT id, title FROM courses LIMIT 3');
    console.log('Available courses:', courses.rows);
    
    // Check students  
    const students = await pool.query('SELECT id, full_name, email FROM students LIMIT 3');
    console.log('Available students:', students.rows);
    
    if (courses.rows.length === 0) {
      return res.json({ 
        success: false, 
        message: 'No courses found. Please add courses first.',
        debug: { tables: tablesCheck.rows, courses: courses.rows, students: students.rows }
      });
    }
    
    if (students.rows.length === 0) {
      return res.json({ 
        success: false, 
        message: 'No students found. Please add students first.',
        debug: { tables: tablesCheck.rows, courses: courses.rows, students: students.rows }
      });
    }
    
    // Try to create enrollment with first available student and course
    const studentId = students.rows[0].id;
    const courseId = courses.rows[0].id;
    
    console.log(`Attempting to enroll student ${studentId} in course ${courseId}`);
    
    const enrollment = await createEnrollment(studentId, courseId, 'active');
    
    console.log('Enrollment created:', enrollment);
    
    res.json({
      success: true,
      message: 'Test enrollment created successfully',
      data: enrollment,
      debug: { studentId, courseId }
    });
    
  } catch (error) {
    console.error('Test enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Test enrollment failed',
      error: error.message
    });
  }
});

// Test endpoint to check what happens when form is submitted
router.post('/test-form-submission', async (req, res) => {
  const testData = {
    name: 'Test Student',
    email: 'test@example.com',
    phone: '1234567890',
    education: 'Bachelor',
    programexp: 'Beginner',
    course: 'Web Development', // This should match a course title
    date: '2024-01-01',
    time: '10:00'
  };
  
  try {
    console.log('=== TESTING FORM SUBMISSION ===');
    console.log('Test data:', testData);
    
    // Simulate the same logic as createProgram
    const { name, email, phone, education, programexp, course } = testData;
    
    // Find course by title
    console.log('Looking for course with title:', course);
    const courseResult = await pool.query('SELECT id, title FROM courses WHERE title ILIKE $1', [course]);
    console.log('Course search result:', courseResult.rows);
    
    if (courseResult.rows.length === 0) {
      // Let's see what courses actually exist
      const allCourses = await pool.query('SELECT id, title FROM courses');
      return res.json({
        success: false,
        message: 'Course not found',
        searchedFor: course,
        availableCourses: allCourses.rows
      });
    }
    
    const courseId = courseResult.rows[0].id;
    
    // Find or create student
    let studentResult = await pool.query('SELECT id FROM students WHERE email = $1', [email]);
    let studentId;
    
    if (studentResult.rows.length === 0) {
      console.log('Creating new student');
      const newStudentResult = await pool.query(
        'INSERT INTO students (full_name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, email, phone, 'temp_password']
      );
      studentId = newStudentResult.rows[0].id;
    } else {
      studentId = studentResult.rows[0].id;
    }
    
    console.log('Student ID:', studentId, 'Course ID:', courseId);
    
    // Create enrollment
    const enrollment = await createEnrollment(studentId, courseId, 'active');
    
    res.json({
      success: true,
      message: 'Test form submission successful',
      data: { studentId, courseId, enrollment }
    });
    
  } catch (error) {
    console.error('Test form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Test form submission failed',
      error: error.message
    });
  }
});

module.exports = router;