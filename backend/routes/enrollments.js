const router = require("express").Router();
const pool = require("../db");

// Get enrolled program count for a student
router.get("/count/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      "SELECT COUNT(*) AS count FROM enrollments WHERE student_id = $1",
      [studentId]
    );

    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get list of courses a student is enrolled in
router.get("/mycourses/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT c.*
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = $1
    `,
      [studentId]
    );

    res.json({ courses: result.rows }); 
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
