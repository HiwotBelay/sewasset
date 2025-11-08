import mysql from 'mysql2/promise';

// Database connection configuration
// These will come from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Initialize database and create table if it doesn't exist
export async function initDatabase() {
  try {
    // Check if environment variables are set
    if (!dbConfig.user || !dbConfig.password || !dbConfig.database) {
      throw new Error('Database configuration is missing. Please check your .env.local file.');
    }

    // Connect directly to the database (it already exists in cPanel)
    const pool = getPool();
    
    // Test connection first
    await pool.query('SELECT 1');
    
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id VARCHAR(255) UNIQUE NOT NULL,
        company_name VARCHAR(255),
        contact_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        submitted_at DATETIME NOT NULL,
        data JSON NOT NULL,
        pricing JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_company (company_name),
        INDEX idx_submitted_at (submitted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Database initialized successfully');
  } catch (error: any) {
    console.error('Database initialization error:', error);
    console.error('DB Config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      hasPassword: !!dbConfig.password
    });
    throw error;
  }
}

