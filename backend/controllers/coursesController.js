const pool = require('../config/database');
const { fetchExternal, fetchInternal } = require('../utils/apiClient');
const path = require('path');

// --- Ensure table exists ---
const ensureCoursesTable = async () => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image_path VARCHAR(255),
      enrolled integer[],
      skills TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createQuery);

  const alterQuery = `
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS enroll_url TEXT;
  `;
  await pool.query(alterQuery);
};

// --- Add new course ---
const addCourse = async (req, res) => {
  try {
    const { title, description, enrolled } = req.body;
    let imagePath = null;

    if (req.file) {
      // store as relative path (for frontend use)
      imagePath = `/uploads/${req.file.filename}`;
    }

    // parse skills JSON string, fallback to empty array if invalid or missing
    let skillsArray = [];
    if (req.body.skills) {
      try {
        skillsArray = JSON.parse(req.body.skills);
        if (!Array.isArray(skillsArray)) skillsArray = [];
      } catch {
        skillsArray = [];
      }
    }

    const insertQuery = `
      INSERT INTO courses (title, description, image_path, enrolled, skills)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [title, description, imagePath, enrolled || null, skillsArray];

    const { rows } = await pool.query(insertQuery, values);

    res.status(201).json({
      message: "Course added successfully",
      course: rows[0],
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
};

// --- Get all courses ---
const getAllCourses = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM courses ORDER BY created_at DESC;");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

const enrollStudent = async (req, res) => {
  const { id } = req.params; // course id
  const { studentId } = req.body; // student id to enroll

  console.log('Enrollment request received:', { courseId: id, studentId });

  try {
    // Import enrollment functions
    const { createEnrollment } = require('./enrollmentController');
    
    // Create enrollment using the new enrollment system
    const enrollment = await createEnrollment(studentId, id, 'active', {
      io: req.app?.get('io'),
      actorRole: req.user?.role || 'course_admin',
      actorId: req.user?.id || null,
    });
    
    console.log('Enrollment created successfully:', enrollment);
    
    res.status(200).json({ 
      success: true,
      message: "Student enrolled successfully",
      data: enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    
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
};

module.exports = {
  ensureCoursesTable,
  addCourse,
  getAllCourses,
  getCourseById,
  enrollStudent,
};