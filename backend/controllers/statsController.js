// controllers/stats.controller.js
const pool = require("../config/database");
const { fetchExternal, fetchInternal } = require('../utils/apiClient');

/**
 * tryCount - tries to count rows from a list of candidate table names.
 * Returns the first successful count (int) or 0 if none exist.
 *
 * @param {string[]} candidates - list of table names to try
 */
async function tryCount(candidates = []) {
  for (const table of candidates) {
    try {
      // Attempt a count. If table doesn't exist this will throw.
      const q = `SELECT COUNT(*)::int AS count FROM ${table}`;
      const { rows } = await pool.query(q);
      if (rows && rows[0] && typeof rows[0].count === "number") {
        return rows[0].count;
      }
    } catch (err) {
      // ignore and try next candidate
    }
  }
  return 0;
}

/**
 * GET /api/stats
 * returns JSON: { students, companies, mentors }
 */
const getStats = async (req, res) => {
  try {
    // define candidate table names for each entity (adjust if your schema differs)
    const studentTables = ["students", "student", "student_profiles", "users"];
    const companyTables = ["companies", "company", "company_profiles", "organizations"];
    const mentorTables = ["mentors", "mentor_profiles", "mentors_profiles", "teachers"];

    // run counts in parallel
    const [students, companies, mentors] = await Promise.all([
      tryCount(studentTables),
      tryCount(companyTables),
      tryCount(mentorTables),
    ]);

    return res.json({ students, companies, mentors });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStats };