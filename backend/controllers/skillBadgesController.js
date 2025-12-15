// backend/controllers/skillBadges.controller.js

const pool = require('../config/database');
const { fetchExternal, fetchInternal } = require('../utils/apiClient');
const { pushNotification, notifyAdmins } = require('../utils/notificationService');

const addSkillBadge = async (req, res) => {
    const { student_name, badge_name, badge_description, verified } = req.body; 

    if (!student_name || !badge_name || !badge_description) {
        return res.status(400).json({ success: false, message: 'All required fields are missing' });
    }

    try {
        // Trim whitespace and normalize spacing for consistent comparisons
        const trimmedName = student_name.trim().replace(/\s+/g, ' ');

        const studentResult = await pool.query(
            `SELECT s.id,
                    COALESCE(u.full_name, s.full_name, s.username) AS full_name
             FROM students s
             LEFT JOIN user_details u ON s.id = u.student_id
             WHERE LOWER(TRIM(COALESCE(u.full_name, s.full_name, s.username))) = LOWER($1)
                OR LOWER(TRIM(COALESCE(s.full_name, ''))) = LOWER($1)
                OR LOWER(TRIM(COALESCE(u.full_name, ''))) = LOWER($1)`,
            [trimmedName]
        );

        if (studentResult.rows.length === 0) {
            // Try partial match as fallback to suggest possible students
                const partialResult = await pool.query(
                     `SELECT s.id,
                                COALESCE(u.full_name, s.full_name, s.username) AS full_name
                      FROM students s
                      LEFT JOIN user_details u ON s.id = u.student_id
                      WHERE LOWER(COALESCE(u.full_name, s.full_name, s.username)) LIKE LOWER($1)
                          OR LOWER(COALESCE(s.full_name, '')) LIKE LOWER($1)
                          OR LOWER(COALESCE(u.full_name, '')) LIKE LOWER($1)
                      LIMIT 5`,
                [`%${trimmedName}%`]
            );
            
            if (partialResult.rows.length > 0) {
                const suggestions = partialResult.rows.map(r => r.full_name).join(', ');
                return res.status(404).json({ 
                    success: false, 
                    message: `Student "${student_name}" not found. Did you mean: ${suggestions}?`
                });
            }
            
            return res.status(404).json({ 
                success: false, 
                message: `Student "${student_name}" not found. Please check the spelling or ensure the student is registered.`
            });
        }
        
        const student_id = studentResult.rows[0].id;
        const actualStudentName = studentResult.rows[0].full_name;

        const badgeResult = await pool.query(
            'INSERT INTO skill_badges (name, description, is_verified) VALUES ($1, $2, $3) RETURNING id',
            [badge_name, badge_description, verified]
        );

        await pool.query(
            'INSERT INTO student_badges (student_id, badge_id) VALUES ($1, $2)',
            [student_id, badgeResult.rows[0].id]
        );

        const ioInstance = req.app?.get('io');

        await pushNotification({
            role: 'student',
            recipientRole: 'student',
            recipientId: student_id,
            type: 'badge_award',
            title: `${badge_name} badge awarded`,
            message: `You just earned the ${badge_name} badge. ${badge_description}`,
            metadata: {
                badgeId: badgeResult.rows[0].id,
                studentId: student_id,
                awardedBy: req.user?.id || null,
            },
            io: ioInstance,
        });

        try {
            await notifyAdmins({
                title: 'Skill badge awarded',
                message: `${req.user?.name || 'A mentor'} awarded ${badge_name} to ${actualStudentName}.`,
                type: 'badge_award',
                metadata: {
                    badgeId: badgeResult.rows[0].id,
                    studentId: student_id,
                    mentorId: req.user?.id || null,
                },
                io: ioInstance,
            });
        } catch (adminBadgeError) {
            console.error('Admin notification error (badge)', adminBadgeError);
        }

        res.json({ success: true, message: 'Skill badge added successfully' });
    } catch (err) {
        console.error('Error in addSkillBadge:', err);
        res.status(500).json({ success: false, message: 'Database error while adding badge' });
    }
};

// MODIFIED: Filters badges by the logged-in student's ID (req.user.id)
const getStudentBadges = async (req, res) => { 
    const student_id = req.user.id; 
    
    try {
        const result = await pool.query(
            `SELECT 
                sb.id, 
                sb.name, 
                sb.description, 
                sb.is_verified, 
                stb.awarded_at, 
                s.full_name
             FROM student_badges stb
             JOIN skill_badges sb ON stb.badge_id = sb.id
             JOIN students s ON stb.student_id = s.id
             WHERE stb.student_id = $1 
             ORDER BY stb.awarded_at DESC`, 
             [student_id]
        );

        res.json({ success: true, data: result.rows });
    } catch (err) {
        // CRITICAL DEBUGGING LINE: Log the exact error from the database to the server console
        console.error('DATABASE ERROR in getStudentBadges:', err.message || err); 
        
        // This response message will be seen on the frontend console (data.message)
        res.status(500).json({ 
            success: false, 
            message: 'Database error while fetching badges. Check server logs for details.' 
        });
    }
};

// Get all students for autocomplete/dropdown
const getAllStudents = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, full_name, email FROM students ORDER BY full_name ASC`
        );
        
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Database error while fetching students' 
        });
    }
};

module.exports = { addSkillBadge, getStudentBadges, getAllStudents };