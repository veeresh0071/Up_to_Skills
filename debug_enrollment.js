// Debug script to check database tables and data
const pool = require('./backend/config/database');

async function debugDatabase() {
  try {
    console.log('=== DEBUGGING DATABASE ===');
    
    // Check if enrollments table exists
    console.log('\n1. Checking if enrollments table exists...');
    const enrollmentsTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'enrollments'
      );
    `);
    console.log('Enrollments table exists:', enrollmentsTableCheck.rows[0].exists);
    
    // Check if courses table exists
    console.log('\n2. Checking if courses table exists...');
    const coursesTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'courses'
      );
    `);
    console.log('Courses table exists:', coursesTableCheck.rows[0].exists);
    
    // Check courses data
    console.log('\n3. Checking courses data...');
    const coursesData = await pool.query('SELECT id, title FROM courses LIMIT 5');
    console.log('Courses in database:', coursesData.rows);
    
    // Check students data
    console.log('\n4. Checking students data...');
    const studentsData = await pool.query('SELECT id, full_name, email FROM students LIMIT 5');
    console.log('Students in database:', studentsData.rows);
    
    // Check enrollments data
    console.log('\n5. Checking enrollments data...');
    const enrollmentsData = await pool.query('SELECT * FROM enrollments LIMIT 5');
    console.log('Enrollments in database:', enrollmentsData.rows);
    
    // Check programs data
    console.log('\n6. Checking recent programs data...');
    const programsData = await pool.query('SELECT id, name, email, course FROM programs ORDER BY created_at DESC LIMIT 3');
    console.log('Recent programs:', programsData.rows);
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await pool.end();
  }
}

debugDatabase();