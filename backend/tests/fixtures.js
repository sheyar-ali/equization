/**
 * tests/fixtures.js
 * Factory helpers that create persisted test data in MongoDB Memory Server.
 */
const mongoose = require('mongoose');
const User     = require('../models/User.model');
const Quiz     = require('../models/Quiz.model');
const Question = require('../models/Question.model');

/** Create a user and return it (password is 'TestPass123!') */
async function createUser(overrides = {}) {
  // Pass the plain password — the User model's pre('save') hook hashes it
  return User.create({
    username:  overrides.username  || 'testuser',
    email:     overrides.email     || 'test@example.com',
    password:  'TestPass123!',      // plain; pre-save hook will hash
    firstName: overrides.firstName || 'Test',
    lastName:  overrides.lastName  || 'User',
    role:      overrides.role      || 'user',
    isVerified: true,
  });
}

/**
 * Create a quiz with `count` questions. Each question has one correct answer.
 * Returns { quiz, questions }.
 */
async function createQuizWithQuestions(creatorId, count = 3, overrides = {}) {
  const quiz = await Quiz.create({
    title:       overrides.title       || 'Test Quiz',
    description: overrides.description || 'A test quiz',
    creator:     creatorId,
    isPublic:    overrides.isPublic !== undefined ? overrides.isPublic : true,
    questions:   [],
  });

  const questions = [];
  for (let i = 0; i < count; i++) {
    const q = await Question.create({
      quiz:         quiz._id,
      questionText: `Question ${i + 1}`,
      questionType: 'multiple-choice',
      timeLimit:    30,
      points:       100,
      order:        i,
      answers: [
        { text: 'Correct', isCorrect: true },
        { text: 'Wrong A',  isCorrect: false },
        { text: 'Wrong B',  isCorrect: false },
      ],
    });
    questions.push(q);
  }

  quiz.questions = questions.map(q => q._id);
  await quiz.save();

  // Reload to populate
  const populated = await Quiz.findById(quiz._id)
    .populate({ path: 'questions', options: { sort: { order: 1 } } });

  return { quiz: populated, questions };
}

/** Generate a JWT token for a user (mirrors what the real auth does) */
function tokenFor(user) {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test_secret_123', { expiresIn: '1h' });
}

module.exports = { createUser, createQuizWithQuestions, tokenFor };
