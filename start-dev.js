const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting development environment...');

const reactApp = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

const jsonServer = spawn('npx', ['json-server', '--watch', 'booking-db.json', '--port', '3001'], {
  stdio: 'inherit',
  shell: true
});

console.log('✅ React app starting on http://localhost:5173');
console.log('✅ JSON Server starting on http://localhost:3001');

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development servers...');
  reactApp.kill();
  jsonServer.kill();
  process.exit();
}); 