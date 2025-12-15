//backend/controllers/companies.controller.js
const pool = require('../config/database');
const { fetchExternal, fetchInternal } = require('../utils/apiClient');

const getCompanies = async (req, res) => {
  try {
    const companies = await pool.query(`SELECT * FROM companies ORDER BY created_at DESC`);
    
    // ✅ FIXED: Return empty array instead of 404 when no companies
    if (!companies.rows.length) {
      return res.status(200).json([]);  // Return empty array, not 404
    }
    
    return res.status(200).json(companies.rows);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM companies WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, message: "Company removed successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getCompanyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Get company basic info
    const companyQuery = `
      SELECT 
        c.id, c.company_name, c.email, c.phone, c.created_at
      FROM companies c
      WHERE c.id = $1;
    `;

    // Get company profile if exists
    const profileQuery = `
      SELECT 
        id, name, website, industry, contact, logo_url, created_at, updated_at
      FROM company_profiles
      WHERE id = $1;
    `;

    // Get interviews conducted by this company
    const interviewsQuery = `
      SELECT 
        id, student_id, interview_date, status, feedback, created_at
      FROM interviews
      WHERE company_id = $1
      ORDER BY interview_date DESC;
    `;

    // Execute queries
    const [companyResult, profileResult, interviewsResult] = await Promise.all([
      pool.query(companyQuery, [id]),
      pool.query(profileQuery, [id]).catch(() => ({ rows: [] })),
      pool.query(interviewsQuery, [id]).catch(() => ({ rows: [] }))
    ]);

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const companyDetails = {
      company: companyResult.rows[0],
      profile: profileResult.rows[0] || null,
      interviews: interviewsResult.rows,
      stats: {
        totalInterviews: interviewsResult.rows.length,
        pendingInterviews: interviewsResult.rows.filter(i => i.status === 'pending').length,
        completedInterviews: interviewsResult.rows.filter(i => i.status === 'completed').length,
        hiredCount: interviewsResult.rows.filter(i => i.status === 'hired').length
      }
    };

    return res.status(200).json({ success: true, data: companyDetails });
  } catch (err) {
    console.error('getCompanyDetails error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = { getCompanies, deleteCompany, getCompanyDetails };