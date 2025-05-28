const migrate = require('migrate');
const path = require('path');

migrate.load({
  stateStore: path.join(__dirname, '.migrate'),
  migrationsDirectory: path.join(__dirname, 'migrations')
}, function (err, set) {
  if (err) throw err;

  set.up(function (err) {
    if (err) throw err;
    console.log('✅ Migration selesai!');
    process.exit();
  });
});
