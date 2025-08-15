const getDbConnection = require('../db');

module.exports.up = function () {
  console.log('🚀 Running migration 001...');
  return getDbConnection().then(db => {
    return db.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``)
      .then(() => {
        return db.changeUser({ database: `${process.env.DB_NAME}` });
      })
      .then(() => {
        return db.execute(`
          CREATE TABLE IF NOT EXISTS \`${process.env.TABLE_NAME_3}\` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  store VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  category VARCHAR(100)
);
        `);
      })
  }); 
};



module.exports.down = function () {
  return getDbConnection().then(db => {
    return db.changeUser({ database: `${process.env.DB_NAME}` }) 
      .then (() => {
        return db.execute(`DROP TABLE IF EXISTS \`${process.env.TABLE_NAME_3}\``)
      });
  });
};
