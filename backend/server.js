// backend/server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const path = require('path');
const { ensureNotificationsTable } = require('./utils/ensureNotificationsTable');
const { ensureAdminBootstrap } = require('./utils/ensureAdminBootstrap');
const { ensureProgramAssignmentsTable } = require('./utils/ensureProgramAssignmentsTable');

// Database connection
const pool = require('./config/database');

// Initialize Express app FIRST
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS = FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
if (!ALLOWED_ORIGINS.length) {
    ALLOWED_ORIGINS.push('http://localhost:3000');
}
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_ORIGINS,
        credentials: true,
    },
});

app.set('io', io);

ensureNotificationsTable()
    .then(() => console.log('✅ Notifications table ready'))
    .catch((err) => {
        console.error('❌ Failed to ensure notifications schema', err);
        process.exit(1);
    });

ensureAdminBootstrap()
    .then(() => console.log('✅ Admin table ready'))
    .catch((err) => {
        console.error('❌ Failed to ensure admin bootstrap', err);
        process.exit(1);
    });

ensureProgramAssignmentsTable()
    .then(() => console.log('✅ program_assignments table ready'))
    .catch((err) => {
        console.error('❌ Failed to ensure program_assignments table', err);
        process.exit(1);
    });

const NOTIFICATION_ROLES = new Set(['student', 'mentor', 'admin', 'company']);

io.on('connection', (socket) => {
    const { role, recipientId } = socket.handshake.auth || {};

    if (!role || !NOTIFICATION_ROLES.has(role)) {
        socket.emit('notifications:error', { message: 'Invalid role supplied' });
        return socket.disconnect(true);
    }

    socket.join(role);
    if (recipientId) {
        socket.join(`${role}:${recipientId}`);
    }

    socket.emit('notifications:ready', {
        role,
        recipientId: recipientId || null,
    });
});

// Scheduled cleanup: purge read notifications older than 7 days.
// Unread notifications are retained indefinitely.
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // run once per day
async function cleanupOldReadNotifications() {
    try {
        const res = await pool.query(
            `DELETE FROM notifications WHERE is_read = TRUE AND created_at < NOW() - INTERVAL '7 days' RETURNING id`);
        if (res && res.rowCount) {
            console.log(`🧹 Cleaned up ${res.rowCount} read notification(s) older than 7 days`);
        } else {
            console.log('🧹 Notification cleanup ran: no old read notifications found');
        }
    } catch (err) {
        console.error('❌ Error during notification cleanup:', err && err.message ? err.message : err);
    }
}

// Start cleanup timer after server starts. Also run once immediately on startup.
setTimeout(() => {
    cleanupOldReadNotifications();
    setInterval(cleanupOldReadNotifications, CLEANUP_INTERVAL_MS);
}, 1000);

// Import routers
const userProfileRoutes = require('./routes/userProfile');
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const mentorProjectRoutes = require('./routes/mentorProjects');
const mentorReviewRoutes = require('./routes/mentorReviews');
const companyProfilesRoutes = require('./routes/companyProfilesRoute');
const statsRoutes = require("./routes/stats");
const testimonialsRouter = require("./routes/testimonials");
const studentsRoutes = require('./routes/students');
const mentorsRoutes = require('./routes/mentors');
const companiesRouter = require("./routes/companiesRoute");
const searchCompaniesRouter = require("./routes/searchCompanies");
const searchProjectRoutes = require('./routes/searchProject');
const searchStudent = require('./routes/searchStudents');
const formRoute = require('./routes/formRoutes');
const skillBadgesRoutes = require('./routes/skillBadges');
const coursesRoutes = require('./routes/coursesRoute');
const interviewRoutes = require('./routes/interviews');
const notificationRoutes = require('./routes/notifications');
const studentProjectsRoutes = require('./routes/studentProjects');

// ✅ MIDDLEWARE SETUP FIRST (CRITICAL for req.body to work)
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));
// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/api/forgot-password', async (req, res) => {
    console.log('🔑 Forgot password route hit');
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateQuery = `
            UPDATE students 
            SET password = $1, updated_at = NOW() 
            WHERE email = $2
            RETURNING id
        `;
        
        const updateResult = await pool.query(updateQuery, [hashedPassword, email]);

        if (updateResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student account not found'
            });
        }

        console.log('✅ Password reset successful');
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('❌ Forgot password error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// ========================================
// ROUTE MOUNTING - ORGANIZED & CLEAN
// ========================================

// Authentication routes
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api', userProfileRoutes);

// ✅ PROJECT ROUTES (CONSOLIDATED)
// Primary endpoint: /api/projects (handles all student project operations)
app.use('/api/projects', projectsRoutes);
// Alternative endpoint: /api/student-projects (for listing with search)
app.use('/api/student-projects', studentProjectsRoutes);

// Mentor & Project Management
app.use('/api/mentor_projects', mentorProjectRoutes);
app.use('/api/mentorreviews', mentorReviewRoutes);

// Company Routes
app.use('/api/company-profiles', companyProfilesRoutes);
app.use('/api/companies', companiesRouter);
app.use('/api/searchcompanies', searchCompaniesRouter);

// Content Routes
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/stats', statsRoutes);

// Education Routes
app.use('/api/courses', coursesRoutes);
app.use('/api/assigned-programs', require('./routes/assignedPrograms'));

// Student & Mentor Routes
app.use('/api/students', studentsRoutes);
app.use('/api/searchStudents', searchStudent);
app.use('/api/mentors', mentorsRoutes);

// Interview Routes
app.use('/api/interviews', interviewRoutes);

// Skills & Badges
app.use('/api/skill-badges', skillBadgesRoutes);

// Form & Contact Routes
app.use('/api/form', formRoute);

// Notification Routes
app.use('/api/notifications', notificationRoutes);

// Enrollment Routes
app.use('/api/enrollments', require("./routes/enrollments"));

// Search Routes
app.use('/api/searchproject', searchProjectRoutes);

// ========================================
// HEALTH CHECK & ERROR HANDLING
// ========================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully',
        timestamp: new Date().toISOString()
    });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start the server last
httpServer.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📋 Available Routes:`);
    console.log(`   - POST /api/projects - Submit new project`);
    console.log(`   - GET /api/projects/:id - Get project by ID`);
    console.log(`   - GET /api/student-projects - List all student projects`);
    console.log(`   - DELETE /api/projects/:id - Delete project`);
});