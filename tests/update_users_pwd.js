const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'mobility.sqlite');
const db = new Database(dbPath);

const admin = db.prepare("SELECT password FROM users WHERE email='admin@mobility.com'").get();
console.log('Admin hash:', admin.password);
db.prepare("UPDATE users SET password = ? WHERE email IN ('carlos.motorista@mobility.com', 'mariana@example.com')").run(admin.password);
console.log('Updated passwords for carlos and mariana to Password@123');
