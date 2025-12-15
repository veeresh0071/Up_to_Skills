const pool = require("../config/database");
const { fetchExternal, fetchInternal } = require('../utils/apiClient');

const ALLOWED_ROLES = new Set(["student", "mentor", "admin", "company"]);
const READ_RETENTION_DAYS = 7;

const mapRowToNotification = (row) => ({
  id: row.id,
  role: row.role,
  recipientRole: row.recipient_role,
  recipientId: row.recipient_id,
  type: row.notification_type,
  title: row.title,
  message: row.message,
  link: row.link,
  metadata: row.metadata || {},
  isRead: row.is_read,
  createdAt: row.created_at,
});

const emitNotification = (io, eventName, payload) => {
  if (!io || !payload?.role) return;
  io.to(payload.role).emit(eventName, payload);
  if (payload.recipientId) {
    io.to(`${payload.role}:${payload.recipientId}`).emit(eventName, payload);
  }
};

const validateRole = (role) => {
  if (!role || !ALLOWED_ROLES.has(role)) {
    const allowed = Array.from(ALLOWED_ROLES).join(", ");
    const error = new Error(`role must be one of: ${allowed}`);
    error.statusCode = 400;
    throw error;
  }
};

exports.listNotifications = async (req, res, next) => {
  try {
    const { role, recipientId, limit = 50 } = req.query;
    validateRole(role);

    const normalizedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    const params = [role];
    let whereClause = "role = $1 AND recipient_id IS NULL";

    if (recipientId) {
      params.push(recipientId);
      whereClause = "role = $1 AND (recipient_id IS NULL OR recipient_id = $2)";
    }

    params.push(READ_RETENTION_DAYS);
    const retentionParamIndex = params.length;
    params.push(normalizedLimit);

    const query = `
      SELECT *
      FROM notifications
      WHERE ${whereClause}
        AND (is_read = FALSE OR created_at >= NOW() - $${retentionParamIndex} * INTERVAL '1 day')
      ORDER BY created_at DESC
      LIMIT $${params.length}
    `;

    const { rows } = await pool.query(query, params);
    res.json({
      success: true,
      data: rows.map(mapRowToNotification),
    });
  } catch (error) {
    next(error);
  }
};

exports.countNotifications = async (req, res, next) => {
  try {
    const { role, recipientId } = req.query;
    validateRole(role);

    const params = [role];
    let whereClause = "role = $1 AND recipient_id IS NULL AND is_read = FALSE";

    if (recipientId) {
      params.push(recipientId);
      whereClause = "role = $1 AND (recipient_id IS NULL OR recipient_id = $2) AND is_read = FALSE";
    }

    const query = `SELECT COUNT(*)::int AS total FROM notifications WHERE ${whereClause}`;
    const { rows } = await pool.query(query, params);
    const total = rows[0]?.total ?? 0;

    res.json({ success: true, data: { total } });
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const {
      role,
      recipientRole = null,
      recipientId = null,
      type = "general",
      title,
      message,
      link = null,
      metadata = {},
    } = req.body;

    validateRole(role);
    validateRole(recipientRole || role);
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "title and message are required",
      });
    }

    const insertQuery = `
      INSERT INTO notifications (role, recipient_role, recipient_id, notification_type, title, message, link, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      role,
      recipientRole || role,
      recipientId || null,
      type || "general",
      title,
      message,
      link,
      metadata,
    ];
    const { rows } = await pool.query(insertQuery, values);
    const notification = mapRowToNotification(rows[0]);

    emitNotification(req.app.get("io"), "notifications:new", notification);

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification id is required",
      });
    }

    const updateQuery = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(updateQuery, [notificationId]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const notification = mapRowToNotification(rows[0]);
    emitNotification(req.app.get("io"), "notifications:updated", notification);

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const { role, recipientId = null } = req.body;
    validateRole(role);

    const params = [role];
    let whereClause = "role = $1 AND recipient_id IS NULL";

    if (recipientId) {
      params.push(recipientId);
      whereClause = "role = $1 AND (recipient_id IS NULL OR recipient_id = $2)";
    }

    const updateQuery = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE ${whereClause}
      RETURNING id, role, recipient_id
    `;

    const { rows } = await pool.query(updateQuery, params);
    const ids = rows.map((row) => row.id);

    if (ids.length) {
      const io = req.app.get("io");
      if (io) {
        io.to(role).emit("notifications:bulk-read", {
          role,
          recipientId: recipientId || null,
          ids,
        });
        if (recipientId) {
          io.to(`${role}:${recipientId}`).emit("notifications:bulk-read", {
            role,
            recipientId,
            ids,
          });
        }
      }
    }

    res.json({
      success: true,
      data: { ids },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    if (!notificationId) {
      return res.status(400).json({ success: false, message: 'Notification id is required' });
    }

    const deleteQuery = `
      DELETE FROM notifications
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(deleteQuery, [notificationId]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const notification = mapRowToNotification(rows[0]);

    const io = req.app.get('io');
    if (io) {
      io.to(notification.role).emit('notifications:deleted', {
        role: notification.role,
        recipientId: notification.recipientId || null,
        id: notification.id,
      });
      if (notification.recipientId) {
        io.to(`${notification.role}:${notification.recipientId}`).emit('notifications:deleted', {
          role: notification.role,
          recipientId: notification.recipientId,
          id: notification.id,
        });
      }
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};