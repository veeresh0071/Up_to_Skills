// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function verifyToken(req, res, next) {
  try {
    // Accept both lowercase and uppercase header key
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ success: false, message: 'Invalid Authorization header format' });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Your auth.js signs payload with { user: { id, role, ... } }
    req.user = decoded.user || decoded;

    // Ensure id exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    next();
  } catch (err) {
    console.error('Token verify error:', err && err.message ? err.message : err);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;