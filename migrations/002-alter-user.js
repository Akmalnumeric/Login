const getDbConnection = require('../db');

module.exports.up = function () {
console.log('🚀 Running migration 002...');
return getDbConnection().then(db => {
    return db.changeUser({ database: `${process.env.DB_NAME}` })
      .then(() => {
        return db.execute(`
            ALTER TABLE users
          ADD COLUMN keterangan VARCHAR(255) NOT NULL AFTER password
        `);
        });
    });
};

module.exports.down = function () {
  return getDbConnection().then(db => {
    return db.changeUser({ database: `${process.env.DB_NAME}` }) 
      .then(() => {
        return db.execute(`ALTER TABLE \`${process.env.TABLE_NAME}\`
        DROP COLUMN keterangan`);
      })
    })
}