// backend/routes/courses.route.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { addCourse, getCourseById, getAllCourses, ensureCoursesTable, enrollStudent } = require("../controllers/coursesController");
const { notifyAdmins } = require("../utils/notificationService");
const pool = require('../config/database');

const router = express.Router();

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// --- Ensure table exists before any operation ---
router.use(async (req, res, next) => {
  try {
    await ensureCoursesTable();
    next();
  } catch (err) {
    console.error("Error ensuring courses table:", err);
    res.status(500).json({ error: "Database setup failed" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    // Try to notify admins about the deleted program (best-effort, don't block deletion)
    try {
      const deleted = result.rows[0];
      const notification = await notifyAdmins({
        title: `Program deleted: ${deleted.title || deleted.name || deleted.id}`,
        message: `${deleted.title || deleted.name || 'A program'} was deleted.`,
        type: 'deletion',
        metadata: { entity: 'program', id: deleted.id || id },
        io: req.app.get('io'),
      });
      console.log('Admin notification created for deleted program:', notification?.id || '<no-id>');
    } catch (notifErr) {
      console.error('Failed to notify admins about program deletion:', notifErr.message || notifErr);
    }

    res.status(200).json({ success: true, message: "Course deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete course",error: err.message });
  }
});


// --- Routes ---
router.post("/", upload.single("image"), addCourse);
router.get("/",getAllCourses)
router.get("/getbyid/:id", getCourseById);
router.put("/enrollstudent/:id",enrollStudent)
module.exports = router;
