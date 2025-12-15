const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// GET /api/student-projects - Student projects with student names
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT DISTINCT 
        p.id, 
        p.title as project_title, 
        p.description,
        p.tech_stack,
        s.full_name as student_name,
        s.email,
        p.created_at
      FROM projects p
      JOIN students s ON p.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.title ILIKE $1 OR s.full_name ILIKE $1 OR p.description ILIKE $1)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY p.created_at DESC`;
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('❌ Student projects error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/student-projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    
    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Project deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
    console.error('❌ Delete project error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
