/**
 * tests/quiz.test.js
 * REST API tests for /api/v1/quizzes — full CRUD.
 *
 * Coverage:
 *  POST   /          – create quiz (auth required, validation)
 *  GET    /          – list public quizzes, pagination, search
 *  GET    /featured  – featured quizzes
 *  GET    /user/my-quizzes – owner's quizzes, requires auth
 *  GET    /:id       – public quiz visible, private requires owner/auth
 *  GET    /code/:code
 *  PUT    /:id       – owner can update, non-owner 403, not found 404
 *  DELETE /:id       – owner can delete, non-owner 403, cascades questions
 *  POST   /:id/duplicate – owner can duplicate
 *  GET    /:id/statistics – owner only
 */

process.env.JWT_SECRET  = 'test_secret_123';
process.env.NODE_ENV    = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/ignored';

jest.mock('../utils/email.util', () => ({
  sendEmail:      jest.fn().mockResolvedValue(true),
  emailTemplates: { verification: () => '', welcomeEmail: () => '', resetPassword: () => '' },
}));

const request  = require('supertest');
const { app }  = require('../server');
const Quiz     = require('../models/Quiz.model');
const Question = require('../models/Question.model');
const { createUser, createQuizWithQuestions, tokenFor } = require('./fixtures');

const VALID_QUIZ = {
  title:       'My Test Quiz',
  description: 'A description for the quiz',
  isPublic:    true,
  difficulty:  'medium',
};

// ─────────────────────────────────────────────────────────────────────────────
// POST / — create quiz
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/quizzes', () => {
  let token;
  beforeEach(async () => {
    const user = await createUser();
    token = tokenFor(user);
  });

  it('creates a quiz for an authenticated user', async () => {
    const res = await request(app)
      .post('/api/v1/quizzes')
      .set('Authorization', `Bearer ${token}`)
      .send(VALID_QUIZ)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.quiz.title).toBe('My Test Quiz');
    expect(res.body.data.quiz._id).toBeTruthy();
  });

  it('returns 401 without auth token', async () => {
    await request(app).post('/api/v1/quizzes').send(VALID_QUIZ).expect(401);
  });

  it('rejects missing title', async () => {
    const { title: _t, ...noTitle } = VALID_QUIZ;
    const res = await request(app)
      .post('/api/v1/quizzes')
      .set('Authorization', `Bearer ${token}`)
      .send(noTitle)
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects title shorter than 3 characters', async () => {
    const res = await request(app)
      .post('/api/v1/quizzes')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...VALID_QUIZ, title: 'ab' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing description', async () => {
    const { description: _d, ...noDesc } = VALID_QUIZ;
    const res = await request(app)
      .post('/api/v1/quizzes')
      .set('Authorization', `Bearer ${token}`)
      .send(noDesc)
      .expect(400);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET / — list quizzes
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/quizzes', () => {
  let owner, ownerToken, othersToken;

  beforeEach(async () => {
    owner      = await createUser({ username: 'owner1', email: 'owner1@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'other1', email: 'other1@x.com' });
    othersToken = tokenFor(other);

    // Public quiz
    await createQuizWithQuestions(owner._id, 2, { title: 'Public Quiz', isPublic: true });
    // Private quiz
    await createQuizWithQuestions(owner._id, 2, { title: 'Private Quiz', isPublic: false });
  });

  it('returns only public quizzes to anonymous users', async () => {
    const res = await request(app).get('/api/v1/quizzes').expect(200);
    // paginatedResponse: data is the array directly, pagination is top-level
    const quizzes = res.body.data;
    expect(Array.isArray(quizzes)).toBe(true);
    const titles = quizzes.map(q => q.title);
    expect(titles).toContain('Public Quiz');
    expect(titles).not.toContain('Private Quiz');
  });

  it('supports ?limit= pagination', async () => {
    const res = await request(app).get('/api/v1/quizzes?limit=1').expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.pagination).toBeTruthy();
  });

  it('supports ?search= title filter', async () => {
    const res = await request(app).get('/api/v1/quizzes?search=Public').expect(200);
    expect(res.body.data.every(q => /Public/i.test(q.title))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /featured
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/quizzes/featured', () => {
  it('returns public quizzes without auth', async () => {
    const owner = await createUser({ username: 'featowner', email: 'feat@x.com' });
    await createQuizWithQuestions(owner._id, 1, { title: 'Featured Quiz', isPublic: true });

    const res = await request(app).get('/api/v1/quizzes/featured').expect(200);
    expect(res.body.success).toBe(true);
    // getFeaturedQuizzes uses successResponse with { quizzes }
    expect(Array.isArray(res.body.data.quizzes)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /user/my-quizzes
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/quizzes/user/my-quizzes', () => {
  it('returns only the authenticated user\'s quizzes', async () => {
    const u1 = await createUser({ username: 'myq1', email: 'myq1@x.com' });
    const u2 = await createUser({ username: 'myq2', email: 'myq2@x.com' });

    await createQuizWithQuestions(u1._id, 1, { title: 'User1 Quiz', isPublic: true });
    await createQuizWithQuestions(u2._id, 1, { title: 'User2 Quiz', isPublic: true });

    const res = await request(app)
      .get('/api/v1/quizzes/user/my-quizzes')
      .set('Authorization', `Bearer ${tokenFor(u1)}`)
      .expect(200);

    // paginatedResponse: data is the array directly
    const quizzes = res.body.data;
    expect(Array.isArray(quizzes)).toBe(true);
    expect(quizzes.some(q => q.title === 'User2 Quiz')).toBe(false);
    expect(quizzes.every(q => q.title !== 'User2 Quiz')).toBe(true);
  });

  it('returns 401 without auth', async () => {
    await request(app).get('/api/v1/quizzes/user/my-quizzes').expect(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /:id
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/quizzes/:id', () => {
  let owner, otherToken, pubQuiz, privQuiz;

  beforeEach(async () => {
    owner = await createUser({ username: 'getowner', email: 'getowner@x.com' });
    const other = await createUser({ username: 'getother', email: 'getother@x.com' });
    otherToken = tokenFor(other);

    const { quiz: pub }  = await createQuizWithQuestions(owner._id, 2, { title: 'PubQ', isPublic: true });
    const { quiz: priv } = await createQuizWithQuestions(owner._id, 2, { title: 'PrivQ', isPublic: false });
    pubQuiz  = pub;
    privQuiz = priv;
  });

  it('returns public quiz without auth', async () => {
    const res = await request(app).get(`/api/v1/quizzes/${pubQuiz._id}`).expect(200);
    expect(res.body.data.quiz.title).toBe('PubQ');
  });

  it('returns 403 for private quiz accessed by non-owner', async () => {
    await request(app)
      .get(`/api/v1/quizzes/${privQuiz._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('returns private quiz to its owner', async () => {
    const res = await request(app)
      .get(`/api/v1/quizzes/${privQuiz._id}`)
      .set('Authorization', `Bearer ${tokenFor(owner)}`)
      .expect(200);
    expect(res.body.data.quiz.title).toBe('PrivQ');
  });

  it('returns 404 for non-existent quiz', async () => {
    await request(app)
      .get('/api/v1/quizzes/000000000000000000000001')
      .expect(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /:id — update quiz
// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/v1/quizzes/:id', () => {
  let owner, ownerToken, otherToken, quiz;

  beforeEach(async () => {
    owner      = await createUser({ username: 'putowner', email: 'putowner@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'putother', email: 'putother@x.com' });
    otherToken  = tokenFor(other);

    const { quiz: q } = await createQuizWithQuestions(owner._id, 1, { title: 'Original Title' });
    quiz = q;
  });

  it('owner can update title and description', async () => {
    const res = await request(app)
      .put(`/api/v1/quizzes/${quiz._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Updated Title', description: 'New desc' })
      .expect(200);

    expect(res.body.data.quiz.title).toBe('Updated Title');
  });

  it('non-owner receives 403', async () => {
    await request(app)
      .put(`/api/v1/quizzes/${quiz._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Stolen Title' })
      .expect(403);
  });

  it('returns 401 without auth', async () => {
    await request(app)
      .put(`/api/v1/quizzes/${quiz._id}`)
      .send({ title: 'Anon Update' })
      .expect(401);
  });

  it('returns 404 for non-existent quiz', async () => {
    await request(app)
      .put('/api/v1/quizzes/000000000000000000000001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Ghost' })
      .expect(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /:id
// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /api/v1/quizzes/:id', () => {
  let owner, ownerToken, otherToken, quiz, questions;

  beforeEach(async () => {
    owner      = await createUser({ username: 'delowner', email: 'delowner@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'delother', email: 'delother@x.com' });
    otherToken  = tokenFor(other);

    const result = await createQuizWithQuestions(owner._id, 3, { title: 'To Delete' });
    quiz      = result.quiz;
    questions = result.questions;
  });

  it('owner can delete quiz', async () => {
    await request(app)
      .delete(`/api/v1/quizzes/${quiz._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    const gone = await Quiz.findById(quiz._id);
    expect(gone).toBeNull();
  });

  it('deleting quiz cascades to its questions', async () => {
    await request(app)
      .delete(`/api/v1/quizzes/${quiz._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    const remaining = await Question.find({ quiz: quiz._id });
    expect(remaining).toHaveLength(0);
  });

  it('non-owner receives 403', async () => {
    await request(app)
      .delete(`/api/v1/quizzes/${quiz._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('returns 401 without auth', async () => {
    await request(app)
      .delete(`/api/v1/quizzes/${quiz._id}`)
      .expect(401);
  });

  it('returns 404 for non-existent quiz', async () => {
    await request(app)
      .delete('/api/v1/quizzes/000000000000000000000001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /:id/duplicate
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/quizzes/:id/duplicate', () => {
  let owner, ownerToken, otherToken, pubQuiz, privQuiz;

  beforeEach(async () => {
    owner      = await createUser({ username: 'dupowner', email: 'dupowner@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'dupother', email: 'dupother@x.com' });
    otherToken  = tokenFor(other);

    const { quiz: pub }  = await createQuizWithQuestions(owner._id, 2, { title: 'Public Original',  isPublic: true  });
    const { quiz: priv } = await createQuizWithQuestions(owner._id, 2, { title: 'Private Original', isPublic: false });
    pubQuiz  = pub;
    privQuiz = priv;
  });

  it('owner can duplicate a quiz', async () => {
    const res = await request(app)
      .post(`/api/v1/quizzes/${pubQuiz._id}/duplicate`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.quiz.title).toMatch(/copy/i);

    // Both quizzes + the private one = 3 total
    const count = await Quiz.countDocuments({ creator: owner._id });
    expect(count).toBe(3);
  });

  it('non-owner cannot duplicate a private quiz (403)', async () => {
    // Private quiz → non-owner gets 403
    await request(app)
      .post(`/api/v1/quizzes/${privQuiz._id}/duplicate`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('non-owner CAN duplicate a public quiz', async () => {
    // Public quiz → allowed for anyone authenticated
    const res = await request(app)
      .post(`/api/v1/quizzes/${pubQuiz._id}/duplicate`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(201);
    expect(res.body.data.quiz.title).toMatch(/copy/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /:id/statistics
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/quizzes/:id/statistics', () => {
  let owner, ownerToken, otherToken, quiz;

  beforeEach(async () => {
    owner      = await createUser({ username: 'statowner', email: 'statowner@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'statother', email: 'statother@x.com' });
    otherToken  = tokenFor(other);

    const { quiz: q } = await createQuizWithQuestions(owner._id, 2, { title: 'Stats Quiz' });
    quiz = q;
  });

  it('owner can view quiz statistics', async () => {
    const res = await request(app)
      .get(`/api/v1/quizzes/${quiz._id}/statistics`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('statistics');
  });

  it('non-owner receives 403', async () => {
    await request(app)
      .get(`/api/v1/quizzes/${quiz._id}/statistics`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('returns 401 without auth', async () => {
    await request(app)
      .get(`/api/v1/quizzes/${quiz._id}/statistics`)
      .expect(401);
  });
});
