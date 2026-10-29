const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'mobility.sqlite');
const db = new Database(dbPath);

console.log('drivers cols:', db.prepare("PRAGMA table_info(drivers)").all().map(c => c.name));
console.log('vehicles cols:', db.prepare("PRAGMA table_info(vehicles)").all().map(c => c.name));
console.log('trips cols:', db.prepare("PRAGMA table_info(trips)").all().map(c => c.name));

const drivers = db.prepare('SELECT * FROM drivers LIMIT 2').all();
console.log('Driver 0:', drivers[0]);
