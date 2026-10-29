const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'mobility.sqlite');
const db = new Database(dbPath);

const carlosDriver = db.prepare("SELECT * FROM drivers WHERE userId = '781786d7-904f-4057-a6eb-ed9254b14292'").get();
console.log('Carlos Driver:', carlosDriver);

const carlosVehicles = db.prepare("SELECT * FROM vehicles WHERE driverId = ?").all(carlosDriver.id);
console.log('Carlos Vehicles:', carlosVehicles);

// Update Carlos to be ONLINE, approved, and located at Piaçabuçu (-10.4056, -36.4344)
db.prepare(`
  UPDATE drivers 
  SET status = 'online', 
      approvalStatus = 'approved',
      currentLat = -10.4056, 
      currentLng = -36.4344 
  WHERE id = ?
`).run(carlosDriver.id);

console.log('Updated Carlos to ONLINE in Piaçabuçu');
