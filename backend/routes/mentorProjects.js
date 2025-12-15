const express = require('express');
const pool = require('../config/database');
const router = express.Router();
// check mentor and insert in mentor_projects table

router.post("/", async (req, res) => {
  const { project_title, mentor_name, total_students } = req.body;

  try {
    // Find mentor_id from mentor_name
    const mentorResult = await pool.query(
      "SELECT id FROM mentors WHERE full_name = $1",
      [mentor_name]
    );

    if (mentorResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Mentor not found. Cannot add project.",
      });
    }

    const mentor_id = mentorResult.rows[0].id;

    // Insert into mentor_projects
    const result = await pool.query(
      `INSERT INTO mentor_projects (project_title, mentor_id, mentor_name, total_students)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [project_title, mentor_id, mentor_name, total_students || 0]
    );
    console.log('Project added successfully!',result.rows[0])
    res.status(201).json({
      success: true,
      message: "Project added successfully!",
      project: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to add project" });
  }
});


// Get all mentor_projects
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mentor_projects");
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch mentor projects" });
  }
});

// Delete a project by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM mentor_projects WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    console.log("Project deleted successfully!", result.rows[0]);
    res.status(200).json({ success: true, message: "Project deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
});


module.exports = router;
