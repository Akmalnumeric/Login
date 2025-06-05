const getDbConnection = require('../db');

module.exports.up = function () {
  console.log('🚀 Running migration 001...');
  return getDbConnection().then(db => {
    return db.execute(`CREATE DATABASE IF NOT EXISTS inventory4;`)
      .then(() => {
        return db.changeUser({ database: 'inventory4' });
      })
      .then(() => {
        return db.execute(`
          CREATE TABLE IF NOT EXISTS users3 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
          )
        `);
      })
      .then(() => {
        return db.execute(`
          ALTER TABLE users3
          ADD COLUMN keterangan VARCHAR(255) NOT NULL AFTER password`); 
      });
  }); 
};



module.exports.down = function () {
  return getDbConnection().then(db => {
    return db.changeUser({ database: 'inventory4' }) 
      .then(() => {
        return db.execute('DROP TABLE IF EXISTS users3');
      })
      .then (() => {
        return db.execute(`
          ALTER TABLE users3
          DROP COLUMN keterangan`)
      });
  });
};
