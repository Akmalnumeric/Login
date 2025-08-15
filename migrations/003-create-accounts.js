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
          CREATE TABLE IF NOT EXISTS \`${process.env.TABLE_NAME_2}\` (
        username VARCHAR(50) PRIMARY KEY,
        active TINYINT(1) DEFAULT 1,
        keterangan TEXT,
        created_by int,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        )
        `);
      })
  }); 
};



module.exports.down = function () {
  return getDbConnection().then(db => {
    return db.changeUser({ database: `${process.env.DB_NAME}` }) 
      .then (() => {
        return db.execute(`DROP TABLE IF EXISTS \`${process.env.TABLE_NAME_2}\``)
      });
  });
};
