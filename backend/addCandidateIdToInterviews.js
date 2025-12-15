require('dotenv').config();
const pool = require('./config/database');

(async () => {
  try {
    console.log('Attempting to add candidate_id column to interviews...');
    await pool.query(`ALTER TABLE interviews ADD COLUMN candidate_id INTEGER NULL`);
    console.log('✅ Column candidate_id added to interviews table.');
  } catch (err) {
    // If the column already exists, Postgres will throw an error code; handle gracefully.
    if (err.code === '42701' || err.code === '42703') {
      console.log('Column candidate_id already exists or interviews table not present. Continuing.');
    } else {
      console.error('❌ Failed to run ALTER TABLE:', err.message || err);
    }
  } finally {
    await pool.end();
  }
})();
