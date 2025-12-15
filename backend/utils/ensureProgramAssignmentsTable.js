const pool = require('../config/database');

async function ensureProgramAssignmentsTable() {
  // Ensure table exists (prefer mentor_id referencing mentors(id))
  await pool.query(`
    CREATE TABLE IF NOT EXISTS program_assignments (
      id SERIAL PRIMARY KEY,
      course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      mentor_id INTEGER REFERENCES mentors(id) ON DELETE CASCADE,
      assigned_on TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // If an old column `mentors_id` exists (legacy), migrate it into `mentor_id` then drop it
  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='program_assignments' AND column_name='mentors_id'
      ) THEN
        -- If mentor_id doesn't exist, create it
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='program_assignments' AND column_name='mentor_id'
        ) THEN
          ALTER TABLE program_assignments ADD COLUMN mentor_id INTEGER;
        END IF;

        -- Copy data from legacy column
        UPDATE program_assignments SET mentor_id = mentors_id WHERE mentor_id IS NULL;

        -- Try to add FK constraint to mentors(id) if missing
        BEGIN
          ALTER TABLE program_assignments
            ADD CONSTRAINT fk_program_assignments_mentor_id FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE;
        EXCEPTION WHEN duplicate_object THEN
          -- constraint already exists
        END;

        -- Drop legacy column
        ALTER TABLE program_assignments DROP COLUMN IF EXISTS mentors_id;
      END IF;
    END$$;
  `);

  // Add indexes if they don't exist
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_program_assignments_course_id ON program_assignments(course_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_program_assignments_mentor_id ON program_assignments(mentor_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_program_assignments_assigned_on ON program_assignments(assigned_on);`);
}

module.exports = { ensureProgramAssignmentsTable };
