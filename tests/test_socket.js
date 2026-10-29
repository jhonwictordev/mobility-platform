const { io } = require('socket.io-client');

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket Gateway on port 3001! Socket ID:', socket.id);
  socket.emit('join:passenger', { passengerId: 'e83aa0cc-a990-461e-9351-02124a60cbfa' });
  socket.emit('join:driver', { driverId: '1d6c577b-6e05-4f11-b8be-1fc8837083aa' });
  console.log('Joined passenger and driver rooms.');
  setTimeout(() => {
    socket.disconnect();
    process.exit(0);
  }, 1000);
});

socket.on('connect_error', (err) => {
  console.error('❌ Socket connect error:', err.message);
  process.exit(1);
});
