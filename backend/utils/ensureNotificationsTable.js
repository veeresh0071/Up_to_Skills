const pool = require("../config/database");

const NOTIFICATION_ROLES = "('student','mentor','admin','company')";

async function ensureNotificationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      role VARCHAR(20) NOT NULL CHECK (role IN ${NOTIFICATION_ROLES}),
      recipient_id INTEGER,
      notification_type VARCHAR(50) NOT NULL DEFAULT 'general',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS role VARCHAR(20);`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_id INTEGER;`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50);`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title TEXT;`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS message TEXT;`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT;`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`);
  await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_role VARCHAR(20);`);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'notifications'::regclass
          AND conname = 'notifications_role_check'
      ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notifications_role_check CHECK (role IN ${NOTIFICATION_ROLES});
      END IF;
    END$$;
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'notifications'::regclass
          AND conname = 'notifications_recipient_role_check'
      ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notifications_recipient_role_check CHECK (recipient_role IN ${NOTIFICATION_ROLES});
      END IF;
    END$$;
  `);

  await pool.query(`UPDATE notifications SET recipient_role = role WHERE recipient_role IS NULL;`);
  await pool.query(`UPDATE notifications SET notification_type = 'general' WHERE notification_type IS NULL OR notification_type = '';`);

  await pool.query(`ALTER TABLE notifications ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;`);
  await pool.query(`ALTER TABLE notifications ALTER COLUMN is_read SET DEFAULT FALSE;`);
  await pool.query(`ALTER TABLE notifications ALTER COLUMN created_at SET DEFAULT NOW();`);
  await pool.query(`ALTER TABLE notifications ALTER COLUMN recipient_id DROP NOT NULL;`);
  await pool.query(`ALTER TABLE notifications ALTER COLUMN recipient_role SET NOT NULL;`);
  await pool.query(`ALTER TABLE notifications ALTER COLUMN notification_type SET DEFAULT 'general';`);
  await pool.query(`ALTER TABLE notifications ALTER COLUMN notification_type SET NOT NULL;`);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(role);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_recipient_role ON notifications(role, recipient_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);`);
}

module.exports = {
  ensureNotificationsTable,
};
