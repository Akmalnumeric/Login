const path = require('path');
require('dotenv').config(); // agar .env bisa digunakan

// Ambil argumen dari command line
const [migrationName, direction] = process.argv.slice(2);

if (!migrationName || !direction) {
  console.error('Usage: node migrate.js <migrationName> <up|down>');
  process.exit(1);
}

if (direction !== "up" && direction !== "down") {
  console.error("Error: direction hanya bisa 'up' atau 'down'")
  process.exit(1);
}

const fs = require('fs');
const files = fs.readdirSync(path.join(__dirname, 'migrations'));
const matchedFile = files.find(file => file.startsWith(migrationName));

if (!matchedFile) {
  console.error(`Migration ${migrationName} not found.`);
  process.exit(1);
}

const migration = require(`./migrations/${matchedFile}`);

if (typeof migration[direction] !== 'function') {
  console.error(`Migration does not have '${direction}' function.`);
  process.exit(1);
}

console.log(`🚀 Running migration ${migrationName} (${direction})...`);
migration[direction]()
  .then(() => {
    console.log('✅ Migration completed successfully.');
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err);
  })
  .finally(() => {
    process.exit(0);});
