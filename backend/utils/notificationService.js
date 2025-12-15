const pool = require("../config/database");

const ADMIN_ROLE = "admin";

const INSERT_NOTIFICATION = `
  INSERT INTO notifications (role, recipient_role, recipient_id, notification_type, title, message, link, metadata)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *;
`;

const normalizeNotification = (row) => ({
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

async function pushNotification({
  role,
  recipientRole = role,
  recipientId = null,
  type = "general",
  title,
  message,
  link = null,
  metadata = {},
  io,
}) {
  if (!role || !title || !message) {
    throw new Error("role, title and message are required to push a notification");
  }
  const { rows } = await pool.query(INSERT_NOTIFICATION, [
    role,
    recipientRole || role,
    recipientId,
    type || "general",
    title,
    message,
    link,
    metadata,
  ]);

  const notification = normalizeNotification(rows[0]);

  if (io) {
    io.to(role).emit("notifications:new", notification);
    if (recipientId) {
      io.to(`${role}:${recipientId}`).emit("notifications:new", notification);
    }
  }

  return notification;
}

async function ensureWelcomeNotification({ role, recipientId, name, io }) {
  if (!role || !recipientId) {
    return null;
  }

  const existing = await pool.query(
    `SELECT 1 FROM notifications WHERE role = $1 AND recipient_id = $2 LIMIT 1`,
    [role, recipientId]
  );

  if (existing.rowCount > 0) {
    return null;
  }

  const friendlyName = name ? `, ${name.split(" ")[0]}` : "";

  return pushNotification({
    role,
    recipientRole: role,
    recipientId,
    type: "welcome",
    title: `Welcome${friendlyName}!`,
    message: "You are fully set up to receive live updates.",
    metadata: { type: "welcome" },
    io,
  });
}

module.exports = {
  pushNotification,
  ensureWelcomeNotification,
  notifyAdmins: ({ title, message, type = "admin_alert", metadata = {}, io }) =>
    pushNotification({
      role: ADMIN_ROLE,
      recipientRole: ADMIN_ROLE,
      recipientId: null,
      type,
      title,
      message,
      metadata,
      io,
    }),
};
