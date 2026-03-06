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

    // Create training_topics table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS training_topics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic_id VARCHAR(50) UNIQUE NOT NULL,
        category_id VARCHAR(10) NOT NULL,
        subcategory VARCHAR(255),
        topic_name VARCHAR(500) NOT NULL,
        description TEXT,
        duration_hours INT,
        difficulty_level ENUM('Basic', 'Intermediate', 'Advanced') NOT NULL,
        delivery_mode VARCHAR(50),
        department_relevance TEXT,
        goal_G1 TINYINT DEFAULT 0,
        goal_G2 TINYINT DEFAULT 0,
        goal_G3 TINYINT DEFAULT 0,
        goal_G4 TINYINT DEFAULT 0,
        goal_G5 TINYINT DEFAULT 0,
        goal_G6 TINYINT DEFAULT 0,
        goal_G7 TINYINT DEFAULT 0,
        goal_G8 TINYINT DEFAULT 0,
        goal_G9 TINYINT DEFAULT 0,
        goal_G10 TINYINT DEFAULT 0,
        goal_G11 TINYINT DEFAULT 0,
        goal_G12 TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category_id),
        INDEX idx_subcategory (subcategory),
        INDEX idx_difficulty (difficulty_level),
        INDEX idx_delivery_mode (delivery_mode),
        FULLTEXT idx_search (topic_name, description, subcategory)
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

// Initialize training topics table
export async function initTrainingTopicsTable() {
  try {
    const pool = getPool();
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS training_topics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic_id VARCHAR(50) UNIQUE NOT NULL,
        category_id VARCHAR(10) NOT NULL,
        subcategory VARCHAR(255),
        topic_name VARCHAR(500) NOT NULL,
        description TEXT,
        duration_hours INT,
        difficulty_level ENUM('Basic', 'Intermediate', 'Advanced') NOT NULL,
        delivery_mode VARCHAR(50),
        department_relevance TEXT,
        goal_G1 TINYINT DEFAULT 0,
        goal_G2 TINYINT DEFAULT 0,
        goal_G3 TINYINT DEFAULT 0,
        goal_G4 TINYINT DEFAULT 0,
        goal_G5 TINYINT DEFAULT 0,
        goal_G6 TINYINT DEFAULT 0,
        goal_G7 TINYINT DEFAULT 0,
        goal_G8 TINYINT DEFAULT 0,
        goal_G9 TINYINT DEFAULT 0,
        goal_G10 TINYINT DEFAULT 0,
        goal_G11 TINYINT DEFAULT 0,
        goal_G12 TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category_id),
        INDEX idx_subcategory (subcategory),
        INDEX idx_difficulty (difficulty_level),
        INDEX idx_delivery_mode (delivery_mode),
        FULLTEXT idx_search (topic_name, description, subcategory)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Training topics table initialized successfully');
  } catch (error: any) {
    console.error('Training topics table initialization error:', error);
    throw error;
  }
}