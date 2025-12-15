/**
 * Backfill candidate_id in interviews by matching student names.
 *
 * Usage:
 *   node scripts/backfillCandidateId.js
 *
 * This script will:
 *  - Find interviews where candidate_id IS NULL
 *  - Try to find a student with an exact trimmed case-insensitive name match
 *  - If not found, try a tokenized ILIKE match on first + last name parts
 *  - Update the interviews.candidate_id when a single reliable match is found
 */
require('dotenv').config();
const pool = require('../config/database');

(async () => {
  try {
    console.log('Looking for interviews missing candidate_id...');
    const res = await pool.query('SELECT id, candidate_name, date FROM interviews WHERE candidate_id IS NULL');
    const rows = res.rows || [];
    console.log(`Found ${rows.length} interviews without candidate_id.`);

    for (const iv of rows) {
      const name = (iv.candidate_name || '').toString().trim();
      if (!name) continue;

      // 1) Exact trimmed case-insensitive match
      const exact = await pool.query(
        `SELECT id FROM students WHERE TRIM(LOWER(full_name)) = TRIM(LOWER($1)) LIMIT 1`,
        [name]
      );

      if (exact.rows && exact.rows.length === 1) {
        const sid = exact.rows[0].id;
        await pool.query('UPDATE interviews SET candidate_id = $1 WHERE id = $2', [sid, iv.id]);
        console.log(`Interview ${iv.id}: matched exact student id ${sid} for "${name}"`);
        continue;
      }

      // 2) Tokenized fuzzy match: try first and last token
      const tokens = name.split(/\s+/).filter(Boolean);
      if (tokens.length >= 2) {
        const first = tokens[0];
        const last = tokens[tokens.length - 1];
        const fuzzy = await pool.query(
          `SELECT id, full_name FROM students WHERE full_name ILIKE $1 AND full_name ILIKE $2 LIMIT 1`,
          [`%${first}%`, `%${last}%`]
        );
        if (fuzzy.rows && fuzzy.rows.length === 1) {
          const sid = fuzzy.rows[0].id;
          await pool.query('UPDATE interviews SET candidate_id = $1 WHERE id = $2', [sid, iv.id]);
          console.log(`Interview ${iv.id}: matched fuzzy student id ${sid} -> ${fuzzy.rows[0].full_name} for "${name}"`);
          continue;
        }
      }

      // 3) Last resort: try a loose ILIKE match on name
      const loose = await pool.query(`SELECT id, full_name FROM students WHERE full_name ILIKE $1 LIMIT 2`, [`%${name}%`]);
      if (loose.rows && loose.rows.length === 1) {
        const sid = loose.rows[0].id;
        await pool.query('UPDATE interviews SET candidate_id = $1 WHERE id = $2', [sid, iv.id]);
        console.log(`Interview ${iv.id}: matched loose student id ${sid} -> ${loose.rows[0].full_name} for "${name}"`);
        continue;
      }

      console.log(`Interview ${iv.id}: no reliable student match found for "${name}"`);
    }

    console.log('Backfill complete.');
  } catch (err) {
    console.error('Error during backfill:', err);
  } finally {
    try { await pool.end(); } catch (e) {}
  }
})();
