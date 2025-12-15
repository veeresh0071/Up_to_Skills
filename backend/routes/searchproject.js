const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.get("/search/:term", async (req, res) => {
  try {
    const { term } = req.params;

    const query = `
      SELECT
        id,
        project_title,
        mentor_name,
        total_students
      FROM mentor_projects
      WHERE LOWER(project_title) LIKE LOWER($1)
      ORDER BY project_title ASC
      LIMIT 50
    `;

    const values = [`%${term}%`];

    console.log("SQL Query:", query);
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching projects:", error);
    res.status(500).json({
      success: false,
      message: "Error searching projects",
      error: error.message,
    });
  }
});

// GET ALL projects
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        project_title,
        mentor_name,
        total_students,
        skills
      FROM mentor_projects
      ORDER BY project_title ASC
    `;

    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
});

// DELETE project by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM mentor_projects WHERE id = $1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Project not found" });

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
});

module.exports = router;