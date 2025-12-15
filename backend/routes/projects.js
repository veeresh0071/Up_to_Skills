const express = require('express');
const pool = require('../config/database'); // Assuming '../config/database' is your PostgreSQL connection pool
const router = express.Router();

// --- 🚀 POST: Submit a New Project (Working Code) ---
router.post("/", async (req, res) => {
    const { student_email, title, description, tech_stack, contributions, is_open_source, github_pr_link } = req.body;
    let student_id = null; 

    // Ensure is_open_source is a boolean
    const final_is_open_source = is_open_source === true || is_open_source === 'true'; 

    // 1. INPUT VALIDATION 
    if (!student_email || student_email.trim() === '') {
        return res.status(400).json({ success: false, message: 'Student Email is required.' });
    }
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Project Title is required.' });
    }
    if (!description || description.trim() === '') {
        return res.status(400).json({ success: false, message: 'Project Description is required.' });
    }
    if (!tech_stack || tech_stack.trim() === '') {
        return res.status(400).json({ success: false, message: 'Technology Stack is required.' });
    }
    if (!contributions || contributions.trim() === '') {
        return res.status(400).json({ success: false, message: 'Your Contributions is required.' });
    }

    // GitHub URL validation
    if (github_pr_link && github_pr_link.trim() && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(github_pr_link)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid GitHub URL' });
    }

    try {
        // 2. LOOKUP: Find the student's ID using the email
        const studentResult = await pool.query(
            `SELECT id FROM students WHERE email = $1`,
            [student_email]
        );

        if (studentResult.rowCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student email not found in the database. Please check the address.' 
            });
        }

        student_id = studentResult.rows[0].id;

        // Clean up input strings by trimming whitespace before insertion
        const cleanTitle = title.trim();
        const cleanDescription = description.trim();
        const cleanTechStack = tech_stack.trim();
        const cleanContributions = contributions.trim();
        const cleanGithubLink = github_pr_link ? github_pr_link.trim() : null;
        
        // 3. INSERT: Use the retrieved student_id for the project insertion
        const result = await pool.query(
            `INSERT INTO projects (student_id, title, description, tech_stack, contributions, is_open_source, github_pr_link)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [student_id, cleanTitle, cleanDescription, cleanTechStack, cleanContributions, final_is_open_source, cleanGithubLink]
        );
        
        console.log('Project submitted successfully!', result.rows[0]);
    
        res.status(201).json({ message: "Project submitted successfully!", project: result.rows[0] });
    } catch (err) {
        // Log the specific database error for debugging
        console.error("Project Submission Error (Database/Server):", err.message); 
        res.status(500).json({ error: "Failed to submit project. A server error occurred. Check server console for details." });
    }
});

// --- 📥 GET: Get assigned projects for a student (The Fix) ---
router.get("/assigned/:studentId", async (req, res) => {
    const studentId = req.params.studentId; 
    
    // debug log removed to avoid noisy terminal output

    try {
        const query = `
            SELECT
                p.*,
                s.full_name,  -- 🏆 FIX: Corrected from s.name to s.full_name
                s.email
            FROM projects p
            JOIN students s ON p.student_id = s.id
            WHERE p.student_id = $1
            ORDER BY p.created_at DESC;
        `;

        const result = await pool.query(query, [studentId]);
        
        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching assigned projects:', err.message);
        return res
            .status(500)
            .json({ success: false, message: 'Server error fetching projects', error: err.message });
    }
});


// --- 📥 GET: Get all projects (Placeholder) ---
router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT 
                p.*,
                s.full_name
            FROM projects p
            JOIN students s ON p.student_id = s.id
            ORDER BY p.created_at DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching all projects:', err.message);
        res.status(500).json({ success: false, message: 'Server error fetching all projects' });
    }
});

// --- 🗑️ DELETE: Delete a project by id (Placeholder) ---
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully', data: result.rows[0] });
    } catch (err) {
        console.error('Error deleting project:', err.message);
        res.status(500).json({ success: false, message: 'Server error deleting project' });
    }
});


module.exports = router;