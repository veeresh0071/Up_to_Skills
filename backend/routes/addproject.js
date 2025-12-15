const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// ✅ Assign a student to a project
router.post("/assign-student", async (req, res) => {
  const { project_id, student_id } = req.body;

  try {
    // Basic validation
    if (!project_id || !student_id) {
      return res.status(400).json({ success: false, message: "project_id and student_id required" });
    }

    // Check if already assigned
    const existing = await pool.query(
      `SELECT * FROM project_assignments WHERE project_id = $1 AND student_id = $2`,
      [project_id, student_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Student already assigned to this project" });
    }

    // Assign the student to the project
    const result = await pool.query(
      `INSERT INTO project_assignments (project_id, student_id, assigned_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [project_id, student_id]
    );

    // Optionally update student count
    await pool.query(
      `UPDATE mentor_projects SET total_students = total_students + 1 WHERE id = $1`,
      [project_id]
    );

    res.status(201).json({
      success: true,
      message: "Student assigned successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error assigning student:", err);
    res.status(500).json({ success: false, message: "Failed to assign student" });
  }
});

module.exports = router;
