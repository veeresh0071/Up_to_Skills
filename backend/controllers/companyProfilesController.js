// controllers/companyProfiles.controller.js
const pool = require('../config/database');
const { fetchExternal, fetchInternal } = require('../utils/apiClient');

/**
 * GET all company profiles
 */
const getCompanyProfiles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM company_profiles');
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'No company profiles found' });

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getCompanyProfiles error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET company profile by ID
 */
const getCompanyProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM company_profiles WHERE id=$1', [id]);

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: 'Company profile not found' });

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getCompanyProfileById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET logged-in company profile
 * Returns company info even if profile row doesn't exist
 */
const getMyCompanyProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const companyId = req.user.id;

    const result = await pool.query(
      `SELECT c.id AS company_id, c.company_name, c.username,c.email, c.phone,
              cp.id AS profile_id, cp.name, cp.website, cp.industry, cp.contact, cp.logo_url, cp.created_at, cp.updated_at
       FROM companies c
       LEFT JOIN company_profiles cp ON cp.company_id = c.id
       WHERE c.id = $1`,
      [companyId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const row = result.rows[0];
    const merged = {
      company_id: row.company_id,
      company_name: row.company_name,
      username: row.username,
      email: row.email,
      phone: row.phone,
      profile_id: row.profile_id,
      name: row.name,
      website: row.website,
      industry: row.industry,
      contact: row.contact,
      logo_url: row.logo_url,
      created_at: row.created_at,
      updated_at: row.updated_at
    };

    res.json({ success: true, data: merged });
  } catch (err) {
    console.error('getMyCompanyProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * ADD or UPDATE company profile manually
 */
const addOrUpdateCompanyProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const companyId = req.user.id;
    const username = req.body.username || null;
    const name = req.body.name || req.body.companyName || null;
    const website = req.body.website || null;
    const industry = req.body.industry || null;
    const contact = req.body.contact || null;
    const logo_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if profile exists
    const existing = await pool.query(
      'SELECT * FROM company_profiles WHERE company_id=$1',
      [companyId]
    );

    let result;

    if (existing.rows.length > 0) {
      // UPDATE existing profile
      const oldLogo = existing.rows[0].logo_url;
      const finalLogo = logo_url || oldLogo;

      result = await pool.query(
        `UPDATE company_profiles
         SET name=$1, website=$2, industry=$3, contact=$4, logo_url=$5, updated_at=NOW()
         WHERE company_id=$6
         RETURNING *`,
        [name, website, industry, contact, finalLogo, companyId]
      );
    } else {
      // INSERT new profile
      result = await pool.query(
        `INSERT INTO company_profiles (company_id, name, website, industry, contact, logo_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING *`,
        [companyId, name, website, industry, contact, logo_url]
      );
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('addOrUpdateCompanyProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// For compatibility with routes
const addCompanyProfile = addOrUpdateCompanyProfile;
const updateCompanyProfile = addOrUpdateCompanyProfile;

module.exports = {
  getCompanyProfiles,
  getCompanyProfileById,
  getMyCompanyProfile,
  addCompanyProfile,
  updateCompanyProfile
};