// backend/controllers/students.controller.js
const pool = require('../config/database');
const { fetchExternal, fetchInternal } = require('../utils/apiClient');

/**
 * ✅ Fetch latest students (safe for use from frontend)
 * Returns rows as-is from DB. Clients may normalize fields.
 */
const getStudents = async (req, res) => {
  try {
  const query = `
  SELECT
    s.id,
    s.username,
    COALESCE(u.full_name, s.full_name) AS full_name,
    s.email,
    COALESCE(u.contact_number, s.phone) AS contact_number,
    u.linkedin_url,
    u.github_url,
    u.why_hire_me,
    u.ai_skill_summary,
    u.domains_of_interest,
    u.others_domain,
    u.profile_completed,
    s.created_at
  FROM students s
  LEFT JOIN user_details u ON s.id = u.student_id
  ORDER BY s.created_at DESC;
`;



    const result = await pool.query(query);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getStudents error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Fetch a single student (detailed)
 * Supports fetching from both `students` and `user_details` tables.
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        s.id,
        s.username,
        s.full_name,
        s.email,
        s.phone,
        s.created_at,
        u.id AS user_detail_id,
        u.full_name AS profile_full_name,
        u.contact_number,
        u.linkedin_url,
        u.github_url,
        u.why_hire_me,
        u.profile_completed,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.created_at AS profile_created_at,
        u.updated_at AS profile_updated_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE s.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getStudentById error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Search by name (legacy route /search/:name)
 * Case-insensitive search for compatibility with old API.
 */
const searchStudents = async (req, res) => {
  try {
    const { name } = req.params;

    const query = `
      SELECT
        s.id,
        s.username,
        COALESCE(u.full_name, s.full_name) AS full_name,
        s.email,
        s.phone,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.profile_completed,
        s.created_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE LOWER(s.full_name) LIKE LOWER($1)
         OR LOWER(u.full_name) LIKE LOWER($1)
      ORDER BY s.created_at DESC;
    `;

    const result = await pool.query(query, [`%${name}%`]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No students found' });
    }

    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('searchStudents error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Enhanced search endpoint (recommended)
 * Route: /api/students/search?q=keyword
 * Searches by name, AI skill summary, domains, or others_domain.
 */
const searchStudentsByQuery = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter 'q' is required" });
    }

    const like = `%${q}%`;

    const query = `
      SELECT
        s.id,
        s.username,
        COALESCE(u.full_name, s.full_name) AS full_name,
        s.email,
        s.phone,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.profile_completed,
        s.created_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE LOWER(s.full_name) LIKE LOWER($1)
         OR LOWER(u.full_name) LIKE LOWER($1)
         OR LOWER(COALESCE(u.ai_skill_summary, '')) LIKE LOWER($1)
         OR LOWER(COALESCE(u.domains_of_interest::text, '')) LIKE LOWER($1)
         OR LOWER(COALESCE(u.others_domain, '')) LIKE LOWER($1)
      ORDER BY s.created_at DESC;
    `;

    const result = await pool.query(query, [like]);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('searchStudentsByQuery error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Get complete student details with all activities
 * Route: /api/students/:id/details
 * Returns profile, projects, badges, enrollments, and attendance
 */
const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Get basic profile info
    const profileQuery = `
      SELECT
        s.id,
        s.full_name,
        s.email,
        s.phone,
        s.created_at,
        u.full_name AS profile_full_name,
        u.contact_number,
        u.linkedin_url,
        u.github_url,
        u.why_hire_me,
        u.profile_completed,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.created_at AS profile_created_at,
        u.updated_at AS profile_updated_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE s.id = $1;
    `;

    // Get projects
    const projectsQuery = `
      SELECT 
        id, title, description, tech_stack, contributions,
        is_open_source, github_pr_link, created_at, updated_at
      FROM projects
      WHERE student_id = $1
      ORDER BY created_at DESC;
    `;

    // Get skill badges
    const badgesQuery = `
      SELECT 
        sb.id, sb.name, sb.description, sb.is_verified,
        stb.awarded_at
      FROM student_badges stb
      JOIN skill_badges sb ON stb.badge_id = sb.id
      WHERE stb.student_id = $1
      ORDER BY stb.awarded_at DESC;
    `;

    // Get enrollments
    const enrollmentsQuery = `
      SELECT 
        e.id, e.enrolled_at, e.status,
        c.title AS course_name, c.description AS course_description
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = $1
      ORDER BY e.enrolled_at DESC;
    `;

    // Get attendance
    const attendanceQuery = `
      SELECT date, status, created_at
      FROM attendance
      WHERE student_id = $1
      ORDER BY date DESC
      LIMIT 30;
    `;

    // Execute all queries
    const [profileResult, projectsResult, badgesResult, enrollmentsResult, attendanceResult] = await Promise.all([
      pool.query(profileQuery, [id]),
      pool.query(projectsQuery, [id]),
      pool.query(badgesQuery, [id]),
      pool.query(enrollmentsQuery, [id]),
      pool.query(attendanceQuery, [id])
    ]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const studentDetails = {
      profile: profileResult.rows[0],
      projects: projectsResult.rows,
      badges: badgesResult.rows,
      enrollments: enrollmentsResult.rows,
      attendance: attendanceResult.rows,
      stats: {
        totalProjects: projectsResult.rows.length,
        totalBadges: badgesResult.rows.length,
        totalEnrollments: enrollmentsResult.rows.length,
        attendanceRate: attendanceResult.rows.length > 0 
          ? ((attendanceResult.rows.filter(a => a.status === 'present').length / attendanceResult.rows.length) * 100).toFixed(1)
          : 0
      }
    };

    return res.status(200).json({ success: true, data: studentDetails });
  } catch (err) {
    console.error('getStudentDetails error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * Example: Fetch data from an external API
 * Use this pattern when calling third-party services
 */
const fetchExternalStudentData = async (req, res) => {
  try {
    const { externalId } = req.params;
    
    // Example: Fetch from external API (LinkedIn, GitHub, etc.)
    const externalData = await fetchExternal(
      `https://api.example.com/users/${externalId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
        },
      }
    );
    
    return res.status(200).json({ success: true, data: externalData });
  } catch (err) {
    console.error('fetchExternalStudentData error:', err);
    return res.status(err.status || 500).json({ 
      success: false, 
      message: err.message || 'Failed to fetch external data' 
    });
  }
};

/**
 * Example: Call another internal microservice
 * Use this pattern for service-to-service communication
 */
const syncStudentWithService = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get student from local DB
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    const student = result.rows[0];
    
    // Sync with another internal service (e.g., analytics, notifications)
    const syncResult = await fetchInternal('/analytics/track-student', {
      method: 'POST',
      data: {
        studentId: student.id,
        email: student.email,
        action: 'profile_sync',
      },
    });
    
    return res.status(200).json({ 
      success: true, 
      data: student,
      syncStatus: syncResult 
    });
  } catch (err) {
    console.error('syncStudentWithService error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Sync failed',
      error: err.message 
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  searchStudents,
  searchStudentsByQuery,
  getStudentDetails,
  fetchExternalStudentData,
  syncStudentWithService,
};