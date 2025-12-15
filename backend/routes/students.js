// backend/routes/students.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Controllers
const {
  getStudents,
  getStudentById,
  searchStudents,
  searchStudentsByQuery,
  getStudentDetails
} = require("../controllers/studentsController");

// Middlewares
const verifyToken = require("../middleware/auth");

/*==========================================================
 🟢 TOTAL STUDENTS COUNT  (NO TOKEN REQUIRED)
==========================================================*/
router.get("/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*)::int AS total_students FROM students"
    );

    res.json({
      success: true,
      totalStudents: result.rows[0].total_students,
    });
  } catch (err) {
    console.error("❌ Error fetching student count:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/*==========================================================
 🔴 DELETE STUDENT  (TOKEN REQUIRED)
==========================================================*/
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Student deleted",
      data: result.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/*==========================================================
 🔍 SEARCH ROUTES
==========================================================*/

// Search with query params: /api/students/search?name=John
router.get("/search", searchStudentsByQuery);

// Token-protected search: /api/students/search/:name
router.get("/search/:name", verifyToken, searchStudents);

// Autocomplete without token
router.get("/autocomplete", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        COALESCE(u.full_name, s.full_name, s.username) AS name,
        s.email,
        s.phone
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      ORDER BY COALESCE(u.full_name, s.full_name, s.username) ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching autocomplete:", error);
    res.status(500).json({ error: "Server error fetching autocomplete" });
  }
});

/*==========================================================
 🧑‍🎓 GET ALL STUDENTS
==========================================================*/
router.get("/all-students", getStudents);

// Default list route
router.get("/", getStudents);

/*==========================================================
 🟦 STUDENT DETAILS / PROFILE
==========================================================*/
router.get("/:id/details", getStudentDetails);

// Alias route
router.get("/student/:id", getStudentById);

// Get by ID (keep last due to route priority)
router.get("/:id", getStudentById);

module.exports = router;
