const mysql = require('mysql2/promise');
require('dotenv').config();

function getDbConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

module.exports = getDbConnection;
