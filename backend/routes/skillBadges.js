// backend/routes/skillBadges.js

const express = require("express");
const router = express.Router();
const pool = require("../config/database");

const {
  addSkillBadge,
  getStudentBadges,
  getAllStudents
} = require("../controllers/skillBadgesController");

const authMiddleware = require("../middleware/auth");

/*==========================================================
 🟢 TOTAL VERIFIED BADGES COUNT  (NO TOKEN REQUIRED)
==========================================================*/
router.get("/count", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(
          CASE 
            WHEN jsonb_typeof(badges) = 'array' THEN jsonb_array_length(badges)
            ELSE 0
          END
        ), 0) AS total_badges
      FROM students
    `);

    res.json({
      success: true,
      totalBadges: Number(result.rows[0].total_badges) || 0,
    });
  } catch (error) {
    console.error("❌ Error fetching skill badges count:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/*==========================================================
 🟦 ADD SKILL BADGE (MENTOR ACTION)
==========================================================*/
router.post("/", authMiddleware, addSkillBadge);

/*==========================================================
 🟦 STUDENT BADGES (REQUIRES TOKEN)
==========================================================*/
router.get("/", authMiddleware, getStudentBadges);

/*==========================================================
 🟦 ALL STUDENTS FOR MENTOR BADGE DROPDOWN
==========================================================*/
router.get("/students", authMiddleware, getAllStudents);

module.exports = router;
