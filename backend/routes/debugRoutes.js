const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Debug endpoint to check database state
router.get('/database-state', async (req, res) => {
  try {
    const result = {
      tables: {},
      counts: {}
    };
    
    // Check each table
    const tables = ['enrollments', 'courses', 'students', 'programs'];
    
    for (const table of tables) {
      try {
        // Check if table exists
        const existsResult = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [table]);
        
        result.tables[table] = existsResult.rows[0].exists;
        
        if (existsResult.rows[0].exists) {
          // Get count
          const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
          result.counts[table] = parseInt(countResult.rows[0].count);
          
          // Get sample data
          const sampleResult = await pool.query(`SELECT * FROM ${table} LIMIT 3`);
          result[`${table}_sample`] = sampleResult.rows;
        }
      } catch (error) {
        result.tables[table] = false;
        result[`${table}_error`] = error.message;
      }
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to manually insert test data
router.post('/create-test-data', async (req, res) => {
  try {
    // Create a test course if none exists
    const courseCheck = await pool.query('SELECT COUNT(*) FROM courses');
    if (parseInt(courseCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO courses (title, description, skills) 
        VALUES 
        ('Web Development', 'Learn modern web development', ARRAY['HTML', 'CSS', 'JavaScript']),
        ('Data Science', 'Learn data analysis and machine learning', ARRAY['Python', 'SQL', 'Statistics']),
        ('Cybersecurity', 'Learn cybersecurity fundamentals', ARRAY['Security', 'Networking', 'Ethical Hacking'])
      `);
    }
    
    // Create a test student if none exists
    const studentCheck = await pool.query('SELECT COUNT(*) FROM students');
    if (parseInt(studentCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO students (full_name, email, phone, password) 
        VALUES ('Test Student', 'test@example.com', '1234567890', 'password123')
      `);
    }
    
    res.json({ success: true, message: 'Test data created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;