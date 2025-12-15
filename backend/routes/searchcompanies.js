const express = require("express");
const router = express.Router();
const pool = require("../config/database"); // your PG pool module

// ===============================
// SEARCH companies by name substring (case-insensitive)
// ===============================
router.get("/search/:term", async (req, res) => {
  try {
    const { term } = req.params;

    const query = `
      SELECT
        id,
        company_name,
        email,
        phone
      FROM companies
      WHERE LOWER(company_name) LIKE LOWER($1)
      ORDER BY company_name ASC
      LIMIT 50
    `;

    const values = [`%${term}%`];

    const result = await pool.query(query, values);

    // Return raw array as frontend requires
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching companies:", error);
    res.status(500).json({
      success: false,
      message: "Error searching companies",
      error: error.message,
    });
  }
});

// ===============================
// GET ALL companies
// ===============================
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        company_name,
        email,
        phone
      FROM companies
      ORDER BY company_name ASC
    `;

    const result = await pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching companies",
      error: error.message,
    });
  }
});

// ===============================
// DELETE company by ID
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM companies WHERE id = $1", [id]);

    // You might want to check rowCount to confirm deletion
    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Company not found" });

    res.status(200).json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting company",
      error: error.message,
    });
  }
});

module.exports = router;
