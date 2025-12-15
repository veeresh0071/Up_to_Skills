const pool = require("../config/database");
const bcrypt = require("bcryptjs");

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "Admin123";
const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || "Admin";

async function ensureAdminBootstrap() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS full_name TEXT;`);

  const existing = await pool.query("SELECT id FROM admins WHERE email = $1 LIMIT 1", [
    DEFAULT_ADMIN_EMAIL,
  ]);

  if (!existing.rowCount) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    await pool.query(
      "INSERT INTO admins (email, password, full_name) VALUES ($1, $2, $3)",
      [DEFAULT_ADMIN_EMAIL, hashedPassword, DEFAULT_ADMIN_NAME]
    );
    console.log(`✅ Seeded default admin account (${DEFAULT_ADMIN_EMAIL})`);
  }
}

module.exports = { ensureAdminBootstrap };
