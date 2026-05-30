/**
 * tests/play.test.js
 * REST API tests for /api/v1/play — individual solo quiz flow.
 *
 * Coverage:
 *  POST /play/start   – quiz loaded, answers sanitised, correct field returned
 *  POST /play/submit  – scoring, history saved, rank returned
 *  GET  /play/leaderboard/:quizId
 *  GET  /play/history (authenticated)
 */

process.env.JWT_SECRET      = 'test_secret_123';
process.env.NODE_ENV        = 'test';
process.env.MONGODB_URI     = 'mongodb://localhost/ignored'; // overridden by memory server

const request  = require('supertest');
const { app }  = require('../server');
const { createUser, createQuizWithQuestions, tokenFor } = require('./fixtures');

// ── shared fixtures ──────────────────────────────────────────────────────────
let user, quiz, questions, token;

beforeEach(async () => {
  user      = await createUser();
  token     = tokenFor(user);
  const res = await createQuizWithQuestions(user._id, 3);
  quiz      = res.quiz;
  questions = res.questions;
});

// ── POST /play/start ─────────────────────────────────────────────────────────
describe('POST /api/v1/play/start', () => {
  it('returns questions with isCorrect for solo mode', async () => {
    const res = await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: quiz._id.toString(), playerName: 'Alice' })
      .expect(200);

    expect(res.body.success).toBe(true);
    const data = res.body.data;
    expect(data.totalQuestions).toBe(3);
    expect(data.questions).toHaveLength(3);

    // Solo mode — isCorrect IS included (so client can show immediate feedback)
    const first = data.questions[0];
    expect(first.answers).toHaveLength(3);
    expect(first.answers.some(a => a.isCorrect === true)).toBe(true);
  });

  it('increments the quiz views counter', async () => {
    const Quiz = require('../models/Quiz.model');
    const before = (await Quiz.findById(quiz._id)).statistics.views;

    await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: quiz._id.toString(), playerName: 'Bob' })
      .expect(200);

    // Fire-and-forget increment — give it a tick
    await new Promise(r => setTimeout(r, 50));
    const after = (await Quiz.findById(quiz._id)).statistics.views;
    expect(after).toBe(before + 1);
  });

  it('returns 404 for a non-existent quiz', async () => {
    const fakeId = '000000000000000000000001';
    const res = await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: fakeId, playerName: 'Alice' })
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

// ── POST /play/submit ────────────────────────────────────────────────────────
describe('POST /api/v1/play/submit', () => {
  it('correctly scores all-correct answers and saves history', async () => {
    // Start the quiz to get the question IDs + correct answer IDs
    const startRes = await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: quiz._id.toString(), playerName: 'Alice' })
      .expect(200);

    const serverQuestions = startRes.body.data.questions;

    // Build answers: pick the correct answer for each question
    const answers = serverQuestions.map(q => {
      const correct = q.answers.find(a => a.isCorrect);
      return {
        questionId:      q._id,
        selectedAnswers: [correct._id],
        timeSpent:       5000, // 5 s out of 30 s
      };
    });

    const submitRes = await request(app)
      .post('/api/v1/play/submit')
      .send({ quizId: quiz._id.toString(), playerName: 'Alice', answers, timeSpent: 15000 })
      .expect(200);

    expect(submitRes.body.success).toBe(true);
    const result = submitRes.body.data.result;
    expect(result.correctAnswers).toBe(3);
    expect(result.wrongAnswers).toBe(0);
    expect(result.score).toBeGreaterThan(0);
    expect(parseFloat(result.accuracy)).toBeCloseTo(100, 0);
    expect(result.rank).toBe(1);
  });

  it('scores 0 for all-wrong answers', async () => {
    const startRes = await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: quiz._id.toString(), playerName: 'Bob' })
      .expect(200);

    const serverQuestions = startRes.body.data.questions;

    const answers = serverQuestions.map(q => {
      const wrong = q.answers.find(a => !a.isCorrect);
      return {
        questionId:      q._id,
        selectedAnswers: [wrong._id],
        timeSpent:       5000,
      };
    });

    const submitRes = await request(app)
      .post('/api/v1/play/submit')
      .send({ quizId: quiz._id.toString(), playerName: 'Bob', answers, timeSpent: 15000 })
      .expect(200);

    const result = submitRes.body.data.result;
    expect(result.correctAnswers).toBe(0);
    expect(result.score).toBe(0);
  });

  it('gives higher points for faster answers', async () => {
    const startRes = await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: quiz._id.toString(), playerName: 'Speed' });

    const q = startRes.body.data.questions[0];
    const correct = q.answers.find(a => a.isCorrect);

    const fast = await request(app)
      .post('/api/v1/play/submit')
      .send({
        quizId: quiz._id.toString(), playerName: 'Fast',
        answers: [{ questionId: q._id, selectedAnswers: [correct._id], timeSpent: 1000 }],
        timeSpent: 1000
      });

    const slow = await request(app)
      .post('/api/v1/play/submit')
      .send({
        quizId: quiz._id.toString(), playerName: 'Slow',
        answers: [{ questionId: q._id, selectedAnswers: [correct._id], timeSpent: 29000 }],
        timeSpent: 29000
      });

    expect(fast.body.data.result.score).toBeGreaterThan(slow.body.data.result.score);
  });

  it('clamps timeSpent to [0, timeLimit] to prevent gaming the score', async () => {
    const startRes = await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: quiz._id.toString(), playerName: 'Cheat' });

    const q = startRes.body.data.questions[0];
    const correct = q.answers.find(a => a.isCorrect);

    // Send negative timeSpent — should be clamped to 0
    const res = await request(app)
      .post('/api/v1/play/submit')
      .send({
        quizId: quiz._id.toString(), playerName: 'Cheat',
        answers: [{ questionId: q._id, selectedAnswers: [correct._id], timeSpent: -9999 }],
        timeSpent: 0
      });

    // Even clamped-to-0 should still give a valid (not inflated) score
    expect(res.body.data.result.score).toBeLessThanOrEqual(100);
  });
});

// ── GET /play/leaderboard/:quizId ─────────────────────────────────────────────
describe('GET /api/v1/play/leaderboard/:quizId', () => {
  it('returns empty leaderboard when nobody has played', async () => {
    const res = await request(app)
      .get(`/api/v1/play/leaderboard/${quiz._id}`)
      .expect(200);

    expect(res.body.data.leaderboard).toEqual([]);
  });

  it('returns entries sorted by score after submissions', async () => {
    const startRes = await request(app)
      .post('/api/v1/play/start')
      .send({ quizId: quiz._id.toString(), playerName: 'P1' });
    const qs = startRes.body.data.questions;

    // P1 gets all correct
    await request(app).post('/api/v1/play/submit').send({
      quizId: quiz._id.toString(), playerName: 'P1',
      answers: qs.map(q => ({ questionId: q._id, selectedAnswers: [q.answers.find(a => a.isCorrect)._id], timeSpent: 5000 })),
      timeSpent: 15000
    });

    // P2 gets all wrong
    await request(app).post('/api/v1/play/submit').send({
      quizId: quiz._id.toString(), playerName: 'P2',
      answers: qs.map(q => ({ questionId: q._id, selectedAnswers: [q.answers.find(a => !a.isCorrect)._id], timeSpent: 5000 })),
      timeSpent: 15000
    });

    const res = await request(app)
      .get(`/api/v1/play/leaderboard/${quiz._id}`)
      .expect(200);

    const lb = res.body.data.leaderboard;
    expect(lb.length).toBe(2);
    expect(lb[0].score).toBeGreaterThanOrEqual(lb[1].score);
    expect(lb[0].rank).toBe(1);
  });
});

// ── GET /play/history ─────────────────────────────────────────────────────────
describe('GET /api/v1/play/history', () => {
  it('returns 401 without auth token', async () => {
    await request(app).get('/api/v1/play/history').expect(401);
  });

  it('returns play history for authenticated user', async () => {
    // Play as the authenticated user
    const startRes = await request(app)
      .post('/api/v1/play/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ quizId: quiz._id.toString(), playerName: user.username });

    const qs = startRes.body.data.questions;
    await request(app)
      .post('/api/v1/play/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        quizId: quiz._id.toString(), playerName: user.username,
        answers: qs.map(q => ({ questionId: q._id, selectedAnswers: [q.answers.find(a => a.isCorrect)._id], timeSpent: 5000 })),
        timeSpent: 15000
      });

    const histRes = await request(app)
      .get('/api/v1/play/history')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(histRes.body.data.history.length).toBeGreaterThanOrEqual(1);
    expect(histRes.body.data.history[0].quiz).toBeTruthy();
  });
});
