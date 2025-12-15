const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const { notifyAdmins } = require("../utils/notificationService");

// ✅ Fetch all testimonials
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM testimonials ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// ✅ Add a new testimonial
router.post("/", async (req, res) => {
  try {
    const { name, role, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }

    const result = await pool.query(
      "INSERT INTO testimonials (name, role, message) VALUES ($1, $2, $3) RETURNING *",
      [name, role, message]
    );

    try {
      await notifyAdmins({
        title: "New testimonial submitted",
        message: `${name || "Someone"} shared feedback${role ? ` as ${role}` : ""}.`,
        type: "testimonial",
        metadata: {
          testimonialId: result.rows[0].id,
          name,
          role,
        },
        io: req.app.get("io"),
      });
    } catch (adminTestimonialError) {
      console.error("Admin notification error (testimonial):", adminTestimonialError);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding testimonial:", err);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

module.exports = router;