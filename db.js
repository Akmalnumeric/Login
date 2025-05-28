const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'AKMALHAIDAR@88', 
  database: 'inventory'
});

module.exports = pool;
