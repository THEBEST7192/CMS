require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'myphp',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Connected to database');

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        role ENUM('user', 'trusted_user', 'admin') DEFAULT 'user',
        approved BOOLEAN DEFAULT FALSE,
        profile_picture LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table created');

    // Update existing users to set display_name if not set
    await pool.query(`
      UPDATE users 
      SET display_name = username 
      WHERE display_name IS NULL OR display_name = ''
    `);
    console.log('Updated display names for existing users');

    // Create items table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Items table created');

    // Create votes table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT NOT NULL,
        user_id INT NOT NULL,
        vote_type ENUM('upvote', 'downvote') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_vote (item_id, user_id),
        FOREIGN KEY (item_id) REFERENCES items(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Votes table created');

    // Create comments table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        item_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (item_id) REFERENCES items(id)
      )
    `);

    console.log('Comments table created');

    // Check if super admin BobKåre exists, if not create one
    const [superAdminExists] = await pool.query('SELECT * FROM users WHERE username = ?', ['BobKåre']);
    
    if (superAdminExists.length === 0) {
      // Create super admin if doesn't exist
      const superAdminPassword = '%@mcdxcc%/--%c%_/**cllfcbma';
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      
      await pool.query(
        'INSERT INTO users (username, password, display_name, role, approved) VALUES (?, ?, ?, ?, ?)',
        ['BobKåre', hashedPassword, 'BobKåre', 'admin', true]
      );
      
      console.log('Super admin BobKåre created');
    } else {
      console.log('Super admin BobKåre already exists');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initializeDatabase();
