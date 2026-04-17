const io = require('socket.io-client');
const SOCKET_URL = 'http://localhost:5000';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Use known session from host API via REST
const axios = require('axios');
const BASE = 'http://localhost:5000/api/v1';

async function main() {
  // Use the REST API with the known token approach
  // First get a JWT by creating one manually via the backend
  const loginRes = await axios.post(`${BASE}/auth/login`, { 
    email: 'omar@equization.com', 
    password: 'Test1234!'
  }).catch(e => ({ data: e.response?.data }));
  
  const token = loginRes.data?.data?.token;
  console.log('Login:', token ? '✅ token obtained' : '❌ ' + JSON.stringify(loginRes.data));
  if (!token) process.exit(1);

  // Create session via REST
  const sessRes = await axios.post(`${BASE}/host`, 
    { quizId: '69b8781cb2ea052dca39e319' }, 
    { headers: { Authorization: `Bearer ${token}` } }
  ).catch(e => ({ data: e.response?.data }));
  
  console.log('Create session response:', JSON.stringify(sessRes.data).slice(0, 200));
  const sessionCode = sessRes.data?.data?.session?.sessionCode;
  if (!sessionCode) { console.log('❌ No session code'); process.exit(1); }
  console.log('✅ Session:', sessionCode);

  // HOST socket registers
  const hostSocket = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });
  await new Promise((res, rej) => { hostSocket.on('connect', res); setTimeout(rej, 5000); });
  console.log('✅ Host socket:', hostSocket.id);
  
  const regAck = await new Promise(res => hostSocket.emit('host:register-session', { sessionCode }, res));
  console.log('✅ Host registered:', regAck?.success);

  await sleep(200);

  // Player 1 joins
  const p1 = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });
  await new Promise((res, rej) => { p1.on('connect', res); setTimeout(rej, 5000); });
  console.log('✅ P1 socket:', p1.id);
  
  const p1Ack = await new Promise(res => p1.emit('player:join-session', { sessionCode, playerName: 'Ahmed' }, res));
  console.log(p1Ack?.success ? '✅' : '❌', 'P1 join:', p1Ack?.message || 'OK', '| playerId:', p1Ack?.playerId);

  await sleep(500);

  // Player 2 joins  
  const p2 = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });
  await new Promise((res, rej) => { p2.on('connect', res); setTimeout(rej, 5000); });
  console.log('✅ P2 socket:', p2.id);
  
  const p2Ack = await new Promise(res => p2.emit('player:join-session', { sessionCode, playerName: 'Sara' }, res));
  console.log(p2Ack?.success ? '✅' : '❌', 'P2 join:', p2Ack?.message || 'OK', '| playerId:', p2Ack?.playerId);

  hostSocket.disconnect();
  p1.disconnect();
  p2.disconnect();

  console.log('\n=== RESULT ===');
  console.log(p1Ack?.success && p2Ack?.success 
    ? '🎉 BOTH PLAYERS JOINED SUCCESSFULLY!' 
    : '❌ PROBLEM: ' + (p1Ack?.success ? 'P2 failed: ' + p2Ack?.message : 'P1 failed: ' + p1Ack?.message));
  process.exit(0);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
