const express = require("express");
const pool = require("../config/database");
const router = express.Router();
const verifyToken = require("../middleware/auth");

/* =====================================================================
   STUDENT PROFILE — CREATE or UPDATE
===================================================================== */
router.post("/profile", verifyToken, async (req, res) => {
  try {
    const {
      full_name,
      contact_number,
      linkedin_url,
      github_url,
      why_hire_me,
      ai_skill_summary,
      domainsOfInterest,
      othersDomain,
    } = req.body;

    const studentId = req.user.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token: student ID missing",
      });
    }

    // -------- VALIDATION --------
    if (!full_name || !/^[A-Za-z ]+$/.test(full_name.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Full name must contain only letters" });
    }

    if (!contact_number || !/^[0-9]{10}$/.test(contact_number)) {
      return res
        .status(400)
        .json({ success: false, message: "Contact number must be 10 digits" });
    }

    if (
      linkedin_url &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedin_url)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn URL",
      });
    }

    if (
      github_url &&
      !/^https?:\/\/(www\.)?github\.com\/.*$/.test(github_url)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL",
      });
    }

    if (!why_hire_me?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide why hire me",
      });
    }

    if (!ai_skill_summary?.trim()) {
      return res.status(400).json({
        success: false,
        message: "AI skill summary required",
      });
    }

    if (!Array.isArray(domainsOfInterest) || domainsOfInterest.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please select at least two domains",
      });
    }

    // ---- Check if profile exists ----
    const checkResult = await pool.query(
      "SELECT id FROM user_details WHERE student_id = $1",
      [studentId]
    );

    let result;

    if (checkResult.rows.length > 0) {
      result = await pool.query(
        `
        UPDATE user_details
        SET full_name=$1, contact_number=$2, linkedin_url=$3,
            github_url=$4, why_hire_me=$5, profile_completed=TRUE,
            ai_skill_summary=$6, domains_of_interest=$7, others_domain=$8,
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id=$9
        RETURNING *;
      `,
        [
          full_name,
          contact_number,
          linkedin_url,
          github_url,
          why_hire_me,
          ai_skill_summary,
          domainsOfInterest,
          othersDomain,
          studentId,
        ]
      );
    } else {
      result = await pool.query(
        `
        INSERT INTO user_details
        (student_id, full_name, contact_number, linkedin_url, github_url,
         why_hire_me, ai_skill_summary, domains_of_interest, others_domain, profile_completed)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE)
        RETURNING *;
      `,
        [
          studentId,
          full_name,
          contact_number,
          linkedin_url,
          github_url,
          why_hire_me,
          ai_skill_summary,
          domainsOfInterest,
          othersDomain,
        ]
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving student profile:", error);
    res.status(500).json({
      success: false,
      message: "Error saving profile",
    });
  }
});

/* =====================================================================
   GET LOGGED-IN STUDENT PROFILE
===================================================================== */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const query = `
      SELECT
        s.id AS student_id,
        s.username AS student_username,
        s.full_name AS student_name,
        s.email AS student_email,
        s.phone AS student_phone,
        u.*
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE s.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [studentId]);

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

/* =====================================================================
   MENTOR PROFILE — CREATE/UPDATE
===================================================================== */
router.post("/mentor/profile", verifyToken, async (req, res) => {
  try {
    const {
      full_name,
      contact_number,
      linkedin_url,
      github_url,
      about_me,
      expertise_domains,
      others_domain,
    } = req.body;

    const mentorId = req.user.id;

    let expertiseValue = null;

    if (Array.isArray(expertise_domains)) {
      expertiseValue = expertise_domains.length
        ? `{${expertise_domains.map((d) => `"${d}"`).join(",")}}`
        : "{}";
    }

    // Check if exists
    const check = await pool.query(
      "SELECT id FROM mentor_details WHERE mentor_id=$1",
      [mentorId]
    );

    let result;

    if (check.rows.length > 0) {
      result = await pool.query(
        `
        UPDATE mentor_details
        SET
          full_name = $1,
          contact_number = $2,
          linkedin_url = $3,
          github_url = $4,
          about_me = $5,
          expertise_domains = $6::text[],
          others_domain = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE mentor_id = $8
        RETURNING *;
      `,
        [
          full_name,
          contact_number,
          linkedin_url,
          github_url,
          about_me,
          expertiseValue,
          others_domain,
          mentorId,
        ]
      );
    } else {
      result = await pool.query(
        `
        INSERT INTO mentor_details
        (mentor_id, full_name, contact_number, linkedin_url, github_url, about_me, expertise_domains, others_domain)
        VALUES ($1,$2,$3,$4,$5,$6,$7::text[],$8)
        RETURNING *;
      `,
        [
          mentorId,
          full_name,
          contact_number,
          linkedin_url,
          github_url,
          about_me,
          expertiseValue,
          others_domain,
        ]
      );
    }

    res.json({
      success: true,
      message: "Mentor profile saved",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Mentor profile save error:", error);
    res.status(500).json({ success: false, message: "Error saving profile" });
  }
});

/* =====================================================================
   GET LOGGED-IN MENTOR PROFILE  (WITH USERNAME ✔ FIXED)
===================================================================== */
router.get("/mentor/profile", verifyToken, async (req, res) => {
  try {
    const mentorId = req.user.id;

    const query = `
      SELECT
        m.id AS mentor_id,
        m.username AS username,         -- ✔ ADDED
        m.full_name AS mentor_name,
        m.email AS mentor_email,
        md.full_name AS profile_full_name,
        md.contact_number,
        md.linkedin_url,
        md.github_url,
        md.about_me,
        md.expertise_domains,
        md.others_domain,
        md.created_at,
        md.updated_at
      FROM mentors m
      LEFT JOIN mentor_details md ON m.id = md.mentor_id
      WHERE m.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [mentorId]);
    const data = result.rows[0];

    // Normalize array
    if (typeof data.expertise_domains === "string") {
      try {
        data.expertise_domains = JSON.parse(data.expertise_domains);
      } catch {
        data.expertise_domains = [];
      }
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

module.exports = router;
