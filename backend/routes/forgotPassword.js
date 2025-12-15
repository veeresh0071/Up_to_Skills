const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    console.log('Forgot password route hit:', req.body);
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateQuery = `
            UPDATE users 
            SET password = $1, updated_at = NOW() 
            WHERE email = $2 OR username = $2
            RETURNING id
        `;
        
        const result = await pool.query(updateQuery, [hashedPassword, email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email/username'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
});

module.exports = router;
