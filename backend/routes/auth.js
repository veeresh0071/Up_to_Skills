// ========================================
// auth.js - Authentication Routes
// ========================================
const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { ensureWelcomeNotification, pushNotification, notifyAdmins } = require('../utils/notificationService');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ---------------- HELPERS ----------------
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const validateRole = (role) => {
  const roles = ['admin', 'student', 'company', 'mentor'];
  return roles.includes(role.toLowerCase());
};

const formatRoleLabel = (role = '') =>
  role.charAt(0).toUpperCase() + role.slice(1);

// ---------------- GLOBAL USERNAME CHECK ----------------
const isUsernameTaken = async (username) => {
  const query = `
    SELECT username FROM students WHERE username=$1
    UNION
    SELECT username FROM mentors WHERE username=$1
    UNION
    SELECT username FROM companies WHERE username=$1
  `;
  const result = await pool.query(query, [username]);
  return result.rows.length > 0;
};

// API for Frontend Username Live Check
router.post("/check-username", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username)
      return res.json({ available: false });

    const taken = await isUsernameTaken(username);
    return res.json({ available: !taken });

  } catch (error) {
    console.error("Username check error:", error);
    res.json({ available: false });
  }
});

// API to verify if a student email already exists in the platform
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ registered: false, message: "Valid email is required" });
    }

    const { rows } = await pool.query(
      "SELECT id FROM students WHERE LOWER(email)=LOWER($1)",
      [email]
    );

    return res.json({ registered: rows.length > 0 });
  } catch (error) {
    console.error("Email check error:", error);
    return res.status(500).json({ registered: false, message: "Unable to verify email right now" });
  }
});

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, username } = req.body;

    if (!name || !email || !phone || !password || !role || !username) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validateEmail(email))
      return res.status(400).json({ success: false, message: 'Invalid email format' });

    if (!validateRole(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });

    const normalizedRole = role.toLowerCase();

    if (normalizedRole === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin registration is not allowed' });
    }

    // Choose Table
    let tableName =
      normalizedRole === "company"
        ? "companies"
        : normalizedRole === "mentor"
          ? "mentors"
          : "students";

    // Check existing email
    const emailCheck = await pool.query(
      `SELECT * FROM ${tableName} WHERE email=$1`,
      [email]
    );

    if (emailCheck.rows.length > 0)
      return res.status(400).json({ success: false, message: 'Email already exists' });

    // GLOBAL USERNAME CHECK
    if (await isUsernameTaken(username)) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT QUERY
    let insertQuery, values;

    if (normalizedRole === 'company') {
      insertQuery = `
        INSERT INTO companies (company_name, email, phone, password, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, company_name AS name, email, username`;
      values = [name, email, phone, hashedPassword, username];

    } else if (normalizedRole === 'mentor') {
      insertQuery = `
        INSERT INTO mentors (full_name, email, phone, password, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, full_name AS name, email, username`;
      values = [name, email, phone, hashedPassword, username];

    } else {
      insertQuery = `
        INSERT INTO students (full_name, email, phone, password, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, full_name AS name, email, username`;
      values = [name, email, phone, hashedPassword, username];
    }

    const ioInstance = req.app.get('io');
    const result = await pool.query(insertQuery, values);
    const newUser = { ...result.rows[0], role: normalizedRole };

    // Welcome Notification
    try {
      await pushNotification({
        role: normalizedRole,
        recipientRole: normalizedRole,
        recipientId: newUser.id,
        type: 'welcome',
        title: `Welcome to UpToSkills, ${newUser.name}!`,
        message: 'You are all set. Explore the dashboard.',
        metadata: newUser,
        io: ioInstance,
      });
    } catch (error) { }

    // Notify Admin
    try {
      await notifyAdmins({
        title: `New ${formatRoleLabel(normalizedRole)} registered`,
        message: `${newUser.name} just joined.`,
        type: 'user_register',
        metadata: newUser,
        io: ioInstance,
      });
    } catch (error) { }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });

  } catch (error) {
    console.error("REG ERROR:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ success: false, message: 'Email/Username, password and role are required' });

    const normalizedRole = role.toLowerCase();

    // Choose table
    let tableName =
      normalizedRole === "admin"
        ? "admins"
        : normalizedRole === "student"
          ? "students"
          : normalizedRole === "mentor"
            ? "mentors"
            : "companies";

    // Query
    let loginQuery =
      normalizedRole === "admin"
        ? `SELECT * FROM admins WHERE LOWER(email)=LOWER($1)`
        : `SELECT * FROM ${tableName}
           WHERE LOWER(email)=LOWER($1)
           OR LOWER(username)=LOWER($1)`;

    const userResult = await pool.query(loginQuery, [email]);

    if (userResult.rows.length === 0)
      return res.status(400).json({ success: false, message: "Incorrect email/username or password" });

    const user = userResult.rows[0];

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Incorrect email/username or password" });

    // Identify Real Role
    const realRole =
      tableName === "students"
        ? "student"
        : tableName === "mentors"
          ? "mentor"
          : tableName === "companies"
            ? "company"
            : "admin";

    if (realRole !== normalizedRole) {
      return res.status(401).json({
        success: false,
        message: "Incorrect role selected."
      });
    }

    const displayName =
      user.full_name ||
      user.company_name ||
      user.name ||
      user.email;

    const payload = {
      user: {
        id: user.id,
        role: realRole,
        email: user.email,
        name: displayName,
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const ioInstance = req.app.get("io");
    const loginTimestamp = new Date();

    try {
      await pushNotification({
        role: realRole,
        recipientRole: realRole,
        recipientId: user.id,
        type: "security_login",
        title: "New login detected",
        message: `You signed in on ${loginTimestamp.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}. If this wasn't you, please reset your password.`,
        metadata: {
          event: "login",
          userId: user.id,
          loggedInAt: loginTimestamp.toISOString(),
        },
        io: ioInstance,
      });

      await pushNotification({
        role: "admin",
        recipientRole: "admin",
        recipientId: null,
        type: "user_login",
        title: `${formatRoleLabel(realRole)} signed in`,
        message: `${displayName} logged in at ${loginTimestamp.toLocaleTimeString("en-US")}.`,
        metadata: {
          event: "user_login",
          userId: user.id,
          role: realRole,
          email: user.email,
          loggedInAt: loginTimestamp.toISOString(),
        },
        io: ioInstance,
      });
    } catch (err) {
      console.error("Failed to push login notification", err);
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: payload.user,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// ---------------- GET STUDENT ----------------
router.get('/getStudent', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE id=$1",
      [req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;