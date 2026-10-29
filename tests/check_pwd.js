const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'mobility.sqlite');
const db = new Database(dbPath);

const carlos = db.prepare("SELECT * FROM users WHERE email = 'carlos.motorista@mobility.com'").get();
console.log('Carlos:', carlos.name, carlos.email, carlos.password);

// Test some possible passwords
const passwords = ['replace_with_test_password', 'password123', 'admin123', '123456', 'carlos123', 'simbora123'];
for (const p of passwords) {
  if (bcrypt.compareSync(p, carlos.password)) {
    console.log('FOUND PASSWORD:', p);
    break;
  }
}
