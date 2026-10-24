const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'mobility.sqlite');
const db = new Database(dbPath);

console.log('=== TABELAS NO BANCO MOBILITY.SQLITE ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables.map(t => t.name));

for (const t of tables) {
  if (t.name.startsWith('sqlite_')) continue;
  try {
    const count = db.prepare(`SELECT count(*) as total FROM "${t.name}"`).get();
    console.log(`- ${t.name}: ${count.total} registros`);
  } catch (err) {
    console.log(`- ${t.name}: erro ao contar (${err.message})`);
  }
}

console.log('\n=== USUÁRIOS ===');
const users = db.prepare('SELECT id, name, email, role FROM users LIMIT 10').all();
console.table(users);

console.log('\n=== MOTORISTAS ===');
const drivers = db.prepare('SELECT id, userId, licenseNumber, status, rating, totalTrips, approvalStatus FROM drivers LIMIT 10').all();
console.table(drivers);

console.log('\n=== VEÍCULOS ===');
const vehicles = db.prepare('SELECT id, driverId, make, model, year, color, plateNumber, category, approved FROM vehicles LIMIT 10').all();
console.table(vehicles);
