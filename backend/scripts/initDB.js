// scripts/initDB.js
require('dotenv').config();
const pool = require('../config/database');
const { ensureNotificationsTable } = require('../utils/ensureNotificationsTable');

(async () => {
  try {
    // COMPANIES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        company_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    // ENROLLMENTS
await pool.query(`
  CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active'
  );
`);


    // COMPANY PROFILES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_profiles (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        website TEXT,
        industry TEXT,
        contact TEXT,
        logo_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // MENTORS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Mentor details table (profiles for mentors)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mentor_details (
        id SERIAL PRIMARY KEY,
        mentor_id INTEGER UNIQUE REFERENCES mentors(id) ON DELETE CASCADE,
        full_name TEXT,
        contact_number VARCHAR(15),
        linkedin_url TEXT,
        github_url TEXT,
        about_me TEXT,
        expertise_domains TEXT[],
        others_domain TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // SKILL BADGES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skill_badges (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        given_by INTEGER REFERENCES mentors(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // PROGRAMS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone VARCHAR(15),
        education TEXT,
        programexp TEXT,
        course TEXT,
        resume_path TEXT,
        resume_data BYTEA,
        resume_mime TEXT,
        resume_filename TEXT,
        date TEXT,
        time TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // STUDENTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // USER DETAILS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_details (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        full_name VARCHAR(255),
        contact_number VARCHAR(15),
        linkedin_url TEXT,
        github_url TEXT,
        why_hire_me TEXT,
        profile_completed BOOLEAN DEFAULT FALSE,
        ai_skill_summary TEXT,
        domains_of_interest TEXT[],
        others_domain TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ATTENDANCE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(10) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // MENTOR PROJECTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mentor_projects (
        id SERIAL PRIMARY KEY,
        project_title TEXT NOT NULL,
        mentor_id INTEGER REFERENCES mentors(id) ON DELETE SET NULL,
        mentor_name TEXT NOT NULL,
        total_students INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // PROJECTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        mentor_project_id INTEGER REFERENCES mentor_projects(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        description TEXT,
        tech_stack TEXT,
        contributions TEXT,
        is_open_source BOOLEAN DEFAULT false,
        github_pr_link TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // PROJECT ASSIGNMENTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS project_assignments (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        assigned_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // STUDENT BADGES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_badges (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        badge_id INTEGER NOT NULL REFERENCES skill_badges(id) ON DELETE CASCADE,
        given_by INTEGER REFERENCES mentors(id) ON DELETE SET NULL,
        awarded_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // PROGRAM ASSIGNMENTS (assign programs/courses to mentors)
    // Use mentor_id referencing mentors.id (accounts). If legacy column exists, keep it unchanged here;
    // startup migration is handled by ensureProgramAssignmentsTable utility which runs at server boot.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS program_assignments (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        mentor_id INTEGER REFERENCES mentors(id) ON DELETE CASCADE,
        assigned_on TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
    `);

    await ensureNotificationsTable();

    console.log('✅ All tables checked/created successfully');
  } catch (err) {
    console.error("❌ DB Initialization Failed:", err);
  } finally {
    await pool.end();
  }
})();
