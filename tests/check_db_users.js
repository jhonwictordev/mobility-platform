const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'services', 'api', 'mobility.sqlite');
const db = new Database(dbPath);
const users = db.prepare('SELECT id, name, email, role FROM users').all();
console.log('Users in database:', users);

const drivers = db.prepare('SELECT id, userId, status FROM drivers').all();
console.log('Drivers in database:', drivers);
