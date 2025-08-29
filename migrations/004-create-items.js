const getDbConnection = require('../db');

module.exports.up = function () {
  console.log('🚀 Running migration 001...');
  return getDbConnection().then(db => {
    return db.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``)
      .then(() => db.changeUser({ database: `${process.env.DB_NAME}` }))

      // Buat table stores
      .then(() => db.execute(`
        CREATE TABLE IF NOT EXISTS \`${process.env.TABLE_NAME_4}\` (
          store_id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          PRIMARY KEY (store_id)
        )
      `))

      // Buat table categories
      .then(() => db.execute(`
        CREATE TABLE IF NOT EXISTS \`${process.env.TABLE_NAME_5}\` (
          category_id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          PRIMARY KEY (category_id)
        )
      `))

      // Buat table items
      .then(() => db.execute(`
        CREATE TABLE IF NOT EXISTS \`${process.env.TABLE_NAME_3}\` (
          items_id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(12,2) NOT NULL,
          store INT NULL,
          category INT NULL,
          PRIMARY KEY (items_id),
          KEY idx_store (store),
          KEY idx_category (category),
          CONSTRAINT fk_store_id FOREIGN KEY (store) REFERENCES \`${process.env.TABLE_NAME_4}\`(store_id) 
            ON DELETE SET NULL ON UPDATE CASCADE,
          CONSTRAINT fk_category_id FOREIGN KEY (category) REFERENCES \`${process.env.TABLE_NAME_5}\`(category_id) 
            ON DELETE SET NULL ON UPDATE CASCADE
        )
      `));
  }); 
};

module.exports.down = function () {
  return getDbConnection().then(db => {
    return db.changeUser({ database: `${process.env.DB_NAME}` }) 
      .then(() => {
        return db.execute(`
          DROP TABLE IF EXISTS \`${process.env.TABLE_NAME_3}\`;
          DROP TABLE IF EXISTS \`${process.env.TABLE_NAME_4}\`;
          DROP TABLE IF EXISTS \`${process.env.TABLE_NAME_5}\`;
        `);
      });
  });
};
