require('dotenv').config();
const mysql = require('mysql2/promise');

async function initializeDatabase() {
    try {
        // Connect directly to the database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database');

        // Drop existing tables in reverse order of dependencies
        await connection.query('DROP TABLE IF EXISTS comments');
        await connection.query('DROP TABLE IF EXISTS votes');
        await connection.query('DROP TABLE IF EXISTS items');
        await connection.query('DROP TABLE IF EXISTS users');
        console.log('Dropped existing tables');

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                approved BOOLEAN DEFAULT FALSE,
                profile_picture VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created');

        // Create items table
        await connection.query(`
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

        // Create votes table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_id INT NOT NULL,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_id) REFERENCES items(id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE KEY unique_vote (item_id, user_id)
            )
        `);
        console.log('Votes table created');

        // Create comments table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content TEXT NOT NULL,
                item_id INT NOT NULL,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_id) REFERENCES items(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        console.log('Comments table created');

        await connection.end();
        console.log('Database initialization completed');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
