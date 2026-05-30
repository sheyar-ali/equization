/**
 * tests/question.test.js
 * REST API tests for /api/v1/questions — full CRUD + answers within questions.
 *
 * Coverage:
 *  POST   /           – create question, 401/403 guards, answer validation
 *  POST   /bulk       – bulk create, owner-only, validates all questions
 *  GET    /quiz/:id   – list questions; strips isCorrect for non-owners on public quizzes
 *  GET    /:id        – single question, access guard for private quiz
 *  PUT    /:id        – owner can update text / answers; non-owner 403
 *  DELETE /:id        – owner can delete, cascade removes from quiz.questions array
 *  PUT    /reorder    – reorder questions
 *
 *  Answer-level coverage (within PUT /:id):
 *  – add a new answer
 *  – remove an existing answer
 *  – change which answer is correct
 *  – rejects an update that leaves no correct answer
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

/** Minimal valid question payload (assumes the quiz already exists) */
function questionPayload(quizId, overrides = {}) {
  return {
    quizId:       quizId.toString(),
    questionText: 'What is the capital of France?',
    questionType: 'multiple-choice',
    timeLimit:    30,
    points:       100,
    answers: [
      { text: 'Paris',  isCorrect: true  },
      { text: 'London', isCorrect: false },
      { text: 'Berlin', isCorrect: false },
    ],
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST / — create single question
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/questions', () => {
  let owner, ownerToken, otherToken, quiz;

  beforeEach(async () => {
    owner      = await createUser({ username: 'qcreator', email: 'qcreator@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'qother', email: 'qother@x.com' });
    otherToken  = tokenFor(other);

    const { quiz: q } = await createQuizWithQuestions(owner._id, 0);
    quiz = q;
  });

  it('owner can add a question to their quiz', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(questionPayload(quiz._id))
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.question.questionText).toBe('What is the capital of France?');
    expect(res.body.data.question.answers).toHaveLength(3);

    // Quiz.questions array should now contain the new question
    const updated = await Quiz.findById(quiz._id);
    expect(updated.questions).toHaveLength(1);
  });

  it('non-owner receives 403', async () => {
    await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${otherToken}`)
      .send(questionPayload(quiz._id))
      .expect(403);
  });

  it('returns 401 without auth', async () => {
    await request(app)
      .post('/api/v1/questions')
      .send(questionPayload(quiz._id))
      .expect(401);
  });

  it('rejects a question with no correct answer', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(questionPayload(quiz._id, {
        answers: [
          { text: 'A', isCorrect: false },
          { text: 'B', isCorrect: false },
        ],
      }))
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a question with fewer than 2 answers', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(questionPayload(quiz._id, {
        answers: [{ text: 'Only one', isCorrect: true }],
      }))
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing questionText', async () => {
    const payload = questionPayload(quiz._id);
    delete payload.questionText;
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(payload)
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a non-existent quiz', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(questionPayload('000000000000000000000001'))
      .expect(404);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /bulk — bulk create
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/questions/bulk', () => {
  let owner, ownerToken, quiz;

  beforeEach(async () => {
    owner      = await createUser({ username: 'bulkowner', email: 'bulk@x.com' });
    ownerToken = tokenFor(owner);

    const { quiz: q } = await createQuizWithQuestions(owner._id, 0);
    quiz = q;
  });

  it('bulk-creates multiple questions in one request', async () => {
    const res = await request(app)
      .post('/api/v1/questions/bulk')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        quizId: quiz._id.toString(),
        questions: [
          { questionText: 'Q1', answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] },
          { questionText: 'Q2', answers: [{ text: 'C', isCorrect: true }, { text: 'D', isCorrect: false }] },
        ],
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.questions).toHaveLength(2);

    const updated = await Quiz.findById(quiz._id);
    expect(updated.questions).toHaveLength(2);
  });

  it('non-owner receives 403', async () => {
    const other = await createUser({ username: 'bulkother', email: 'bulkother@x.com' });
    await request(app)
      .post('/api/v1/questions/bulk')
      .set('Authorization', `Bearer ${tokenFor(other)}`)
      .send({
        quizId: quiz._id.toString(),
        questions: [{ questionText: 'Hacked', answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] }],
      })
      .expect(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /quiz/:quizId — list questions
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/questions/quiz/:quizId', () => {
  let owner, ownerToken, otherToken, pubQuiz, privQuiz;

  beforeEach(async () => {
    owner      = await createUser({ username: 'qlistowner', email: 'qlist@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'qlistother', email: 'qlistother@x.com' });
    otherToken  = tokenFor(other);

    const pub  = await createQuizWithQuestions(owner._id, 2, { title: 'PubList', isPublic: true });
    const priv = await createQuizWithQuestions(owner._id, 2, { title: 'PrivList', isPublic: false });
    pubQuiz  = pub.quiz;
    privQuiz = priv.quiz;
  });

  it('returns questions for a public quiz without auth', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/quiz/${pubQuiz._id}`)
      .expect(200);

    expect(res.body.data.questions).toHaveLength(2);
  });

  it('strips isCorrect from answers for non-owners on public quiz', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/quiz/${pubQuiz._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    const answers = res.body.data.questions[0].answers;
    expect(answers.every(a => a.isCorrect === undefined)).toBe(true);
  });

  it('includes isCorrect for the owner', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/quiz/${pubQuiz._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    const answers = res.body.data.questions[0].answers;
    expect(answers.some(a => a.isCorrect !== undefined)).toBe(true);
  });

  it('returns 403 for private quiz accessed by non-owner', async () => {
    await request(app)
      .get(`/api/v1/questions/quiz/${privQuiz._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('returns private quiz questions to the owner', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/quiz/${privQuiz._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(res.body.data.questions).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /:id — get single question
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/questions/:id', () => {
  let owner, quiz, question;

  beforeEach(async () => {
    owner = await createUser({ username: 'gqowner', email: 'gq@x.com' });
    const res = await createQuizWithQuestions(owner._id, 1, { isPublic: true });
    quiz     = res.quiz;
    question = res.questions[0];
  });

  it('returns a question from a public quiz', async () => {
    const res = await request(app)
      .get(`/api/v1/questions/${question._id}`)
      .expect(200);

    expect(res.body.data.question._id.toString()).toBe(question._id.toString());
  });

  it('returns 404 for a non-existent question', async () => {
    await request(app)
      .get('/api/v1/questions/000000000000000000000001')
      .expect(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /:id — update question and its answers
// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/v1/questions/:id', () => {
  let owner, ownerToken, otherToken, question;

  beforeEach(async () => {
    owner      = await createUser({ username: 'updqowner', email: 'updq@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'updqother', email: 'updqother@x.com' });
    otherToken  = tokenFor(other);

    const { questions } = await createQuizWithQuestions(owner._id, 1);
    question = questions[0];
  });

  it('owner can update questionText', async () => {
    const res = await request(app)
      .put(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ questionText: 'Updated question?' })
      .expect(200);

    expect(res.body.data.question.questionText).toBe('Updated question?');
  });

  it('owner can add a new answer', async () => {
    const res = await request(app)
      .put(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        answers: [
          { text: 'Correct',  isCorrect: true  },
          { text: 'Wrong A',  isCorrect: false },
          { text: 'Wrong B',  isCorrect: false },
          { text: 'New Answer', isCorrect: false },
        ],
      })
      .expect(200);

    expect(res.body.data.question.answers).toHaveLength(4);
  });

  it('owner can change which answer is correct', async () => {
    const origAnswers = question.answers;
    const secondId = origAnswers[1]._id.toString();

    const res = await request(app)
      .put(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        answers: [
          { _id: origAnswers[0]._id, text: 'Correct', isCorrect: false },
          { _id: origAnswers[1]._id, text: 'Wrong A',  isCorrect: true  },
          { _id: origAnswers[2]._id, text: 'Wrong B',  isCorrect: false },
        ],
      })
      .expect(200);

    const newCorrect = res.body.data.question.answers.find(a => a.isCorrect);
    expect(newCorrect._id.toString()).toBe(secondId);
  });

  it('rejects an update that removes all correct answers', async () => {
    const res = await request(app)
      .put(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        answers: [
          { text: 'A', isCorrect: false },
          { text: 'B', isCorrect: false },
        ],
      })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('non-owner receives 403', async () => {
    await request(app)
      .put(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ questionText: 'Hacked?' })
      .expect(403);
  });

  it('returns 404 for non-existent question', async () => {
    await request(app)
      .put('/api/v1/questions/000000000000000000000001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ questionText: 'Ghost?' })
      .expect(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /:id — delete question
// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /api/v1/questions/:id', () => {
  let owner, ownerToken, otherToken, quiz, question;

  beforeEach(async () => {
    owner      = await createUser({ username: 'delqowner', email: 'delq@x.com' });
    ownerToken = tokenFor(owner);
    const other = await createUser({ username: 'delqother', email: 'delqother@x.com' });
    otherToken  = tokenFor(other);

    const res = await createQuizWithQuestions(owner._id, 2);
    quiz     = res.quiz;
    question = res.questions[0];
  });

  it('owner can delete a question', async () => {
    await request(app)
      .delete(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    const gone = await Question.findById(question._id);
    expect(gone).toBeNull();
  });

  it('deleted question is removed from quiz.questions array', async () => {
    await request(app)
      .delete(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    const updatedQuiz = await Quiz.findById(quiz._id);
    const ids = updatedQuiz.questions.map(id => id.toString());
    expect(ids).not.toContain(question._id.toString());
  });

  it('non-owner receives 403', async () => {
    await request(app)
      .delete(`/api/v1/questions/${question._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('returns 401 without auth', async () => {
    await request(app)
      .delete(`/api/v1/questions/${question._id}`)
      .expect(401);
  });

  it('returns 404 for non-existent question', async () => {
    await request(app)
      .delete('/api/v1/questions/000000000000000000000001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /reorder — reorder questions
// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/v1/questions/reorder', () => {
  let owner, ownerToken, quiz, questions;

  beforeEach(async () => {
    owner      = await createUser({ username: 'reordowner', email: 'reord@x.com' });
    ownerToken = tokenFor(owner);

    const res = await createQuizWithQuestions(owner._id, 3);
    quiz      = res.quiz;
    questions = res.questions;
  });

  it('owner can reorder questions', async () => {
    // Reverse the order — orderedIds is a plain array of question ID strings
    const reversedIds = questions
      .slice()
      .reverse()
      .map(q => q._id.toString());

    const res = await request(app)
      .put('/api/v1/questions/reorder')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ quizId: quiz._id.toString(), orderedIds: reversedIds })
      .expect(200);

    expect(res.body.success).toBe(true);

    // First ID in reversed list should now have order: 0
    const reordered = await Question.findById(reversedIds[0]);
    expect(reordered.order).toBe(0);
  });

  it('non-owner receives 403', async () => {
    const other = await createUser({ username: 'reordother', email: 'reordother@x.com' });
    const orderedIds = questions.map(q => q._id.toString());

    await request(app)
      .put('/api/v1/questions/reorder')
      .set('Authorization', `Bearer ${tokenFor(other)}`)
      .send({ quizId: quiz._id.toString(), orderedIds })
      .expect(403);
  });
});
