require('dotenv').config({ quiet: true });
const io = require('socket.io-client');
const mongoose = require('mongoose');
const GameSession = require('./models/GameSession.model');
const Quiz = require('./models/Quiz.model');
const User = require('./models/User.model');

const SOCKET_URL = 'http://localhost:5000';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Connect to DB to create session properly
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/equization');
  console.log('✅ DB connected');
  
  const quiz = await Quiz.findOne({ 'questions.0': { $exists: true } }).populate('questions');
  console.log('✅ Quiz:', quiz?.title, 'Questions:', quiz?.questions?.length);
  
  const user = await User.findOne({ username: 'omar_quiz' });
  console.log('✅ User:', user?.username);

  // Create session via DB directly (like the REST endpoint does)
  const session = await GameSession.create({
    quiz: quiz._id,
    host: user._id,
    status: 'waiting'
  });
  const sessionCode = session.sessionCode;
  console.log('✅ Session created:', sessionCode, 'status:', session.status);

  await mongoose.disconnect();

  // Now connect HOST socket and register
  const hostSocket = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });
  await new Promise((res, rej) => {
    hostSocket.on('connect', res);
    hostSocket.on('connect_error', (e) => rej(new Error('host: ' + e.message)));
    setTimeout(() => rej(new Error('host timeout')), 5000);
  });
  console.log('✅ Host connected:', hostSocket.id);

  const hostReg = await new Promise(res => hostSocket.emit('host:register-session', { sessionCode }, res));
  console.log(hostReg?.success ? '✅' : '❌', 'Host register:', JSON.stringify(hostReg));

  await sleep(200);

  // PLAYER 1
  const p1Socket = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });
  await new Promise((res, rej) => {
    p1Socket.on('connect', res);
    setTimeout(() => rej(new Error('p1 timeout')), 5000);
  });
  console.log('✅ Player1 connected:', p1Socket.id);

  const p1Join = await new Promise(res => p1Socket.emit('player:join-session', { sessionCode, playerName: 'Ahmed' }, res));
  console.log(p1Join?.success ? '✅' : '❌', 'Player1 join:', JSON.stringify(p1Join));

  await sleep(500);

  // PLAYER 2
  const p2Socket = io(SOCKET_URL, { transports: ['websocket'], forceNew: true });
  await new Promise((res, rej) => {
    p2Socket.on('connect', res);
    setTimeout(() => rej(new Error('p2 timeout')), 5000);
  });
  console.log('✅ Player2 connected:', p2Socket.id);

  const p2Join = await new Promise(res => p2Socket.emit('player:join-session', { sessionCode, playerName: 'Sara' }, res));
  console.log(p2Join?.success ? '✅' : '❌', 'Player2 join:', JSON.stringify(p2Join));

  hostSocket.disconnect();
  p1Socket.disconnect();
  p2Socket.disconnect();

  console.log('\n--- RESULT ---');
  if (p1Join?.success && p2Join?.success) {
    console.log('🎉 BOTH PLAYERS JOINED SUCCESSFULLY!');
  } else {
    console.log('❌ PROBLEM:', !p1Join?.success ? 'P1: ' + p1Join?.message : 'P2: ' + p2Join?.message);
  }
  process.exit(0);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
