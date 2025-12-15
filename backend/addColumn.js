require('dotenv').config();
const pool = require('./config/database');

(async () => {
    try {
        console.log('Attempting to add missing is_verified column...');
        await pool.query(
            `ALTER TABLE skill_badges ADD COLUMN is_verified BOOLEAN DEFAULT FALSE`
        );
        console.log('✅ Column is_verified added to skill_badges table.');
    } catch (err) {
        // This is okay if the column already exists (but we need to ensure it's there)
        if (err.code === '42703') {
             console.log('Column is_verified already exists or table was newly created. Continuing.');
        } else {
             console.error('❌ Failed to run ALTER TABLE:', err.message);
        }
    } finally {
        await pool.end();
    }
})();