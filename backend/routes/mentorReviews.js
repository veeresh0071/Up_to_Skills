// routes/mentorReviews.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // your existing DB config

// Helper: validate rating
function parseAndValidateRating(value) {
  if (value === undefined || value === null) return null;
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 5) return null;
  // round to one decimal place if needed
  return Math.round(parsed * 10) / 10;
}

/**
 * GET /api/mentorreviews
 * Query params:
 *  - page (optional), perPage (optional), sort (optional)
 */
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const perPage = Math.min(100, Math.max(5, parseInt(req.query.perPage || '20', 10)));
    const offset = (page - 1) * perPage;

    const { rows } = await pool.query(
      `SELECT id, mentor, feedback, rating, created_at, updated_at
       FROM mentor_reviews
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [perPage, offset]
    );

    // also return simple meta
    const { rows: countRows } = await pool.query('SELECT COUNT(*)::int AS total FROM mentor_reviews');
    const total = countRows[0].total;

    res.json({
      success: true,
      data: rows,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/mentorreviews/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const { rows } = await pool.query(
      'SELECT id, mentor, feedback, rating, created_at, updated_at FROM mentor_reviews WHERE id = $1',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/mentorreviews
 * body: { mentor, feedback, rating }
 */
router.post('/', async (req, res, next) => {
  try {
    const { mentor, feedback } = req.body;
    const rating = parseAndValidateRating(req.body.rating);

    if (!mentor || !feedback || rating === null) {
      return res.status(400).json({
        success: false,
        message: 'mentor (string), feedback (string) and rating (0-5) are required',
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO mentor_reviews (mentor, feedback, rating)
       VALUES ($1, $2, $3)
       RETURNING id, mentor, feedback, rating, created_at, updated_at`,
      [mentor.trim(), feedback.trim(), rating]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/mentorreviews/:id
 * body can include: mentor, feedback, rating
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const { mentor, feedback } = req.body;
    const rating = req.body.rating !== undefined ? parseAndValidateRating(req.body.rating) : undefined;

    const fields = [];
    const values = [];
    let idx = 1;

    if (mentor !== undefined) {
      if (!mentor || String(mentor).trim() === '') {
        return res.status(400).json({ success: false, message: 'mentor cannot be empty' });
      }
      fields.push(`mentor = $${idx++}`);
      values.push(String(mentor).trim());
    }

    if (feedback !== undefined) {
      if (!feedback || String(feedback).trim() === '') {
        return res.status(400).json({ success: false, message: 'feedback cannot be empty' });
      }
      fields.push(`feedback = $${idx++}`);
      values.push(String(feedback).trim());
    }

    if (rating !== undefined) {
      if (rating === null) {
        return res.status(400).json({ success: false, message: 'rating must be a number between 0 and 5' });
      }
      fields.push(`rating = $${idx++}`);
      values.push(rating);
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No updatable fields provided' });
    }

    // add updated_at
    fields.push(`updated_at = now()`);

    values.push(id); // last placeholder
    const setClause = fields.join(', ');
    const query = `UPDATE mentor_reviews SET ${setClause} WHERE id = $${idx} RETURNING id, mentor, feedback, rating, created_at, updated_at`;

    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/mentorreviews/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const { rowCount } = await pool.query('DELETE FROM mentor_reviews WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
