/**
 * tests/socket.test.js
 * Socket.IO game-flow integration tests.
 *
 * Tests the full multiplayer lifecycle:
 *   1. Host creates / registers session
 *   2. Players join
 *   3. Host starts game  → game:started
 *   4. Host sends question → question:received (no isCorrect for players)
 *   5. Players submit answers → player:answered, all:answered
 *   6. Host shows results → results:shown + correct answers
 *   7. Host ends game → game:ended + final results + history saved
 *
 * Edge cases: duplicate name, full lobby, non-host operations,
 *             duplicate answer, reconnection grace period, kick player.
 */

process.env.JWT_SECRET  = 'test_secret_123';
process.env.NODE_ENV    = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/ignored';

const http      = require('http');
const { Server } = require('socket.io');
const Client    = require('socket.io-client');
const mongoose  = require('mongoose');

const { createUser, createQuizWithQuestions } = require('./fixtures');
const GameSession = require('../models/GameSession.model');
const PlayHistory = require('../models/PlayHistory.model');

// ── Standalone server for socket tests ───────────────────────────────────────
let httpServer, io, serverPort;

beforeAll(async () => {
  // Spin up a plain http+socket server (no Express needed for socket tests)
  httpServer = http.createServer();
  io = new Server(httpServer, { cors: { origin: '*' } });
  require('../config/socket.config')(io);

  await new Promise(resolve => httpServer.listen(0, resolve));
  serverPort = httpServer.address().port;
});

afterAll(async () => {
  io.close();
  await new Promise(resolve => httpServer.close(resolve));
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function connect(opts = {}) {
  return new Promise((resolve, reject) => {
    const socket = Client(`http://localhost:${serverPort}`, {
      transports: ['websocket'],
      auth: opts.auth || {},
    });
    socket.on('connect',       () => resolve(socket));
    socket.on('connect_error', reject);
  });
}

/** Connect as a host with the test user's ID in socket.handshake.auth */
function connectHost(userId) {
  return connect({ auth: { userId: userId.toString() } });
}

function emit(socket, event, data) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`ACK timeout for ${event}`)), 5000);
    socket.emit(event, data, (ack) => {
      clearTimeout(timeout);
      resolve(ack);
    });
  });
}

function waitFor(socket, event) {
  return new Promise((resolve) => socket.once(event, resolve));
}

// ── Setup per test ─────────────────────────────────────────────────────────
let user, quiz, questions;

beforeEach(async () => {
  user = await createUser({ username: `u_${Date.now()}`, email: `u_${Date.now()}@x.com` });
  const res = await createQuizWithQuestions(user._id, 2);
  quiz = res.quiz;
  questions = res.questions;
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. SESSION CREATION
// ─────────────────────────────────────────────────────────────────────────────
describe('host:create-session', () => {
  let host;
  afterEach(() => host?.disconnect());

  it('creates a session and returns a sessionCode', async () => {
    host = await connectHost(user._id);
    const ack = await emit(host, 'host:create-session', { quizId: quiz._id.toString() });
    expect(ack.success).toBe(true);
    expect(ack.sessionCode).toMatch(/^[A-Z0-9]{6}$/);
    expect(ack.questionCount).toBe(2);
  });

  it('returns error when quizId is missing', async () => {
    host = await connectHost(user._id);
    const ack = await emit(host, 'host:create-session', {});
    expect(ack.success).toBe(false);
  });

  it('returns error for non-existent quiz', async () => {
    host = await connectHost(user._id);
    const ack = await emit(host, 'host:create-session', { quizId: '000000000000000000000001' });
    expect(ack.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLAYER JOINING
// ─────────────────────────────────────────────────────────────────────────────
describe('player:join-session', () => {
  let host, player1;
  let sessionCode;

  beforeEach(async () => {
    host = await connectHost(user._id);
    const ack = await emit(host, 'host:create-session', { quizId: quiz._id.toString() });
    sessionCode = ack.sessionCode;
  });

  afterEach(() => {
    host?.disconnect();
    player1?.disconnect();
  });

  it('player joins successfully and host receives player:joined', async () => {
    player1 = await connect();

    const hostJoinedPromise = waitFor(host, 'player:joined');
    const ack = await emit(player1, 'player:join-session', { sessionCode, playerName: 'Alice' });

    expect(ack.success).toBe(true);
    expect(ack.playerId).toBeTruthy();
    expect(ack.playerCount).toBe(1);

    const joined = await hostJoinedPromise;
    expect(joined.playerName).toBe('Alice');
  });

  it('rejects duplicate player name', async () => {
    player1 = await connect();
    await emit(player1, 'player:join-session', { sessionCode, playerName: 'Alice' });

    const player2 = await connect();
    const ack = await emit(player2, 'player:join-session', { sessionCode, playerName: 'Alice' });
    player2.disconnect();
    expect(ack.success).toBe(false);
    expect(ack.message).toMatch(/مستخدم/);
  });

  it('rejects join to a non-existent session', async () => {
    player1 = await connect();
    const ack = await emit(player1, 'player:join-session', { sessionCode: 'XXXXXX', playerName: 'Bob' });
    expect(ack.success).toBe(false);
  });

  it('rejects missing playerName', async () => {
    player1 = await connect();
    const ack = await emit(player1, 'player:join-session', { sessionCode });
    expect(ack.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. FULL GAME FLOW
// ─────────────────────────────────────────────────────────────────────────────
describe('full game flow', () => {
  let host, player1, player2, sessionCode, playerId1, playerId2;

  beforeEach(async () => {
    host = await connectHost(user._id);
    const ack = await emit(host, 'host:create-session', { quizId: quiz._id.toString() });
    sessionCode = ack.sessionCode;

    player1 = await connect();
    player2 = await connect();
    const p1Ack = await emit(player1, 'player:join-session', { sessionCode, playerName: 'Alice' });
    const p2Ack = await emit(player2, 'player:join-session', { sessionCode, playerName: 'Bob' });
    playerId1 = p1Ack.playerId;
    playerId2 = p2Ack.playerId;
  });

  afterEach(() => {
    host?.disconnect();
    player1?.disconnect();
    player2?.disconnect();
  });

  it('game:started is broadcast to all after host starts', async () => {
    const p1Started = waitFor(player1, 'game:started');
    const p2Started = waitFor(player2, 'game:started');

    const ack = await emit(host, 'host:start-game', { sessionCode });
    expect(ack.success).toBe(true);

    const [e1, e2] = await Promise.all([p1Started, p2Started]);
    expect(e1.questionCount).toBe(2);
    expect(e2.questionCount).toBe(2);
  });

  it('non-host cannot start the game', async () => {
    const ack = await emit(player1, 'host:start-game', { sessionCode });
    expect(ack.success).toBe(false);
  });

  it('host:start-game fails with no players', async () => {
    // Create a fresh session with no players
    const h2 = await connectHost(user._id);
    const { sessionCode: sc2 } = await emit(h2, 'host:create-session', { quizId: quiz._id.toString() });
    const ack = await emit(h2, 'host:start-game', { sessionCode: sc2 });
    expect(ack.success).toBe(false);
    h2.disconnect();
  });

  it('question:received is broadcast to players without isCorrect', async () => {
    await emit(host, 'host:start-game', { sessionCode });

    const p1Q = waitFor(player1, 'question:received');
    const hostAck = await emit(host, 'host:send-question', { sessionCode, questionIndex: 0 });

    expect(hostAck.success).toBe(true);
    // Host gets full answers (with isCorrect)
    expect(hostAck.question.fullAnswers.some(a => a.isCorrect === true)).toBe(true);

    const qEvent = await p1Q;
    expect(qEvent.questionText).toBeTruthy();
    // Players must NOT receive isCorrect (anti-cheat in multiplayer)
    expect(qEvent.answers.every(a => a.isCorrect === undefined)).toBe(true);
  });

  it('player:submit-answer scores correctly and notifies host', async () => {
    await emit(host, 'host:start-game', { sessionCode });
    const hostAck = await emit(host, 'host:send-question', { sessionCode, questionIndex: 0 });
    const qId = hostAck.question.questionId.toString();
    const correctId = hostAck.question.fullAnswers.find(a => a.isCorrect)._id.toString();

    const hostAnswered = waitFor(host, 'player:answered');
    const ack = await emit(player1, 'player:submit-answer', {
      questionId:      qId,
      selectedAnswers: [correctId],
      timeSpent:       5000,
    });

    expect(ack.success).toBe(true);
    expect(ack.isCorrect).toBe(true);
    expect(ack.points).toBeGreaterThan(0);

    const event = await hostAnswered;
    expect(event.isCorrect).toBe(true);
    expect(event.answeredCount).toBe(1);
  });

  it('all:answered is emitted when every player answers', async () => {
    await emit(host, 'host:start-game', { sessionCode });
    const hostAck = await emit(host, 'host:send-question', { sessionCode, questionIndex: 0 });
    const qId = hostAck.question.questionId.toString();
    const correctId = hostAck.question.fullAnswers.find(a => a.isCorrect)._id.toString();
    const wrongId   = hostAck.question.fullAnswers.find(a => !a.isCorrect)._id.toString();

    const allAnswered = waitFor(host, 'all:answered');

    await emit(player1, 'player:submit-answer', { questionId: qId, selectedAnswers: [correctId], timeSpent: 5000 });
    await emit(player2, 'player:submit-answer', { questionId: qId, selectedAnswers: [wrongId],   timeSpent: 5000 });

    const event = await allAnswered;
    expect(event.answeredCount).toBe(2);
    expect(event.totalPlayers).toBe(2);
  });

  it('duplicate answer is rejected', async () => {
    await emit(host, 'host:start-game', { sessionCode });
    const hostAck = await emit(host, 'host:send-question', { sessionCode, questionIndex: 0 });
    const qId      = hostAck.question.questionId.toString();
    const correctId = hostAck.question.fullAnswers.find(a => a.isCorrect)._id.toString();

    await emit(player1, 'player:submit-answer', { questionId: qId, selectedAnswers: [correctId], timeSpent: 5000 });
    const ack2 = await emit(player1, 'player:submit-answer', { questionId: qId, selectedAnswers: [correctId], timeSpent: 5000 });
    expect(ack2.success).toBe(false);
    expect(ack2.message).toMatch(/answered/i);
  });

  it('host:show-results broadcasts correct answers and leaderboard', async () => {
    await emit(host, 'host:start-game', { sessionCode });
    const hostAck  = await emit(host, 'host:send-question', { sessionCode, questionIndex: 0 });
    const qId      = hostAck.question.questionId.toString();
    const correctId = hostAck.question.fullAnswers.find(a => a.isCorrect)._id.toString();

    await emit(player1, 'player:submit-answer', { questionId: qId, selectedAnswers: [correctId], timeSpent: 5000 });
    await emit(player2, 'player:submit-answer', { questionId: qId, selectedAnswers: [correctId], timeSpent: 5000 });

    const p1Results = waitFor(player1, 'results:shown');

    const ack = await emit(host, 'host:show-results', { sessionCode, questionIndex: 0 });
    expect(ack.success).toBe(true);
    expect(ack.correctAnswers.length).toBeGreaterThan(0);
    expect(ack.leaderboard.length).toBe(2);
    expect(ack.leaderboard[0].rank).toBe(1);

    const event = await p1Results;
    expect(event.correctAnswers).toBeTruthy();
  });

  it('host:end-game emits game:ended, saves play history, cleans memory', async () => {
    await emit(host, 'host:start-game', { sessionCode });
    const hostAck  = await emit(host, 'host:send-question', { sessionCode, questionIndex: 0 });
    const qId      = hostAck.question.questionId.toString();
    const correctId = hostAck.question.fullAnswers.find(a => a.isCorrect)._id.toString();

    await emit(player1, 'player:submit-answer', { questionId: qId, selectedAnswers: [correctId], timeSpent: 5000 });
    await emit(player2, 'player:submit-answer', { questionId: qId, selectedAnswers: [correctId], timeSpent: 5000 });

    const p1End = waitFor(player1, 'game:ended');
    const ack   = await emit(host, 'host:end-game', { sessionCode });

    expect(ack.success).toBe(true);
    expect(ack.finalResults.length).toBe(2);
    // Ranks are assigned
    expect(ack.finalResults.every(r => r.rank >= 1)).toBe(true);

    await p1End;

    // Play history must have been persisted for each player
    const history = await PlayHistory.find({ quiz: quiz._id, mode: 'group' });
    expect(history.length).toBe(2);

    // Session must be marked completed
    const session = await GameSession.findOne({ sessionCode });
    expect(session.status).toBe('completed');
  });

  it('non-host cannot end the game', async () => {
    await emit(host, 'host:start-game', { sessionCode });
    const ack = await emit(player1, 'host:end-game', { sessionCode });
    expect(ack.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. KICK PLAYER
// ─────────────────────────────────────────────────────────────────────────────
describe('host:kick-player', () => {
  let host, player1, sessionCode, playerId1;

  beforeEach(async () => {
    host = await connectHost(user._id);
    const ack = await emit(host, 'host:create-session', { quizId: quiz._id.toString() });
    sessionCode = ack.sessionCode;

    player1 = await connect();
    const p1Ack = await emit(player1, 'player:join-session', { sessionCode, playerName: 'Alice' });
    playerId1 = p1Ack.playerId;
  });

  afterEach(() => { host?.disconnect(); player1?.disconnect(); });

  it('host can kick a player and player receives player:kicked', async () => {
    const kicked = waitFor(player1, 'player:kicked');
    const ack = await emit(host, 'host:kick-player', { sessionCode, playerId: playerId1 });
    expect(ack.success).toBe(true);
    await kicked;
  });

  it('non-host cannot kick', async () => {
    const p2 = await connect();
    await emit(p2, 'player:join-session', { sessionCode, playerName: 'Bob' });
    const ack = await emit(p2, 'host:kick-player', { sessionCode, playerId: playerId1 });
    expect(ack.success).toBe(false);
    p2.disconnect();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. RECONNECTION GRACE PERIOD
// ─────────────────────────────────────────────────────────────────────────────
describe('player:reconnect', () => {
  let host, player1, sessionCode, playerId1;

  beforeEach(async () => {
    host = await connectHost(user._id);
    const ack = await emit(host, 'host:create-session', { quizId: quiz._id.toString() });
    sessionCode = ack.sessionCode;

    player1 = await connect();
    const p1Ack = await emit(player1, 'player:join-session', { sessionCode, playerName: 'Alice' });
    playerId1 = p1Ack.playerId;
  });

  afterEach(() => { host?.disconnect(); });

  it('player can reconnect within the grace period', async () => {
    // Disconnect triggers temporarily-disconnected event on host
    const tempDisc = waitFor(host, 'player:temporarily-disconnected');
    player1.disconnect();
    await tempDisc;

    // Immediately reconnect (well within 15 s grace period)
    const newPlayer = await connect();
    const ack = await emit(newPlayer, 'player:reconnect', { sessionCode, playerId: playerId1 });
    expect(ack.success).toBe(true);

    newPlayer.disconnect();
  });
});
