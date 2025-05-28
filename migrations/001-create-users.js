const db = require('../db');

exports.up = async function () {
  console.log('🔧 Running migration: create users table...');
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL
    )
  `);
  console.log('✅ Users table created!');
};

exports.down = async function () {
  console.log('🧨 Dropping users table...');
  await db.query('DROP TABLE IF EXISTS users');
  console.log('✅ Users table dropped!');
};
