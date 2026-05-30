/**
 * tests/auth.test.js
 * REST API tests for /api/v1/auth
 *
 * Coverage:
 *  POST /register  – success, duplicate email/username, weak password, missing fields
 *  POST /login     – success, wrong password, unknown email, missing fields
 *  POST /verify-email – valid token, invalid/expired token
 *  GET  /me        – returns current user, 401 without token
 *  PUT  /update-details – updates firstName/lastName/bio, 401 without token
 *  PUT  /update-password – success, wrong current, same password, weak new password
 */

process.env.JWT_SECRET  = 'test_secret_123';
process.env.NODE_ENV    = 'test';
process.env.MONGODB_URI = 'mongodb://localhost/ignored';

const request = require('supertest');
const crypto  = require('crypto');
const { app } = require('../server');
const User    = require('../models/User.model');
const { createUser, tokenFor } = require('./fixtures');

// ── Mock nodemailer so no real emails are sent ────────────────────────────────
jest.mock('../utils/email.util', () => ({
  sendEmail:      jest.fn().mockResolvedValue(true),
  emailTemplates: {
    verification:  () => '<p>verify</p>',
    welcomeEmail:  () => '<p>welcome</p>',
    resetPassword: () => '<p>reset</p>',
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// POST /register
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/register', () => {
  const valid = {
    username:  'alice123',
    email:     'alice@example.com',
    password:  'Password1',
    firstName: 'Alice',
    lastName:  'Smith',
  };

  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(valid).expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.username).toBe('alice123');
    expect(res.body.data.user.isVerified).toBe(false); // email not yet verified
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/api/v1/auth/register').send(valid);
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...valid, username: 'another' })
      .expect(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/email/i);
  });

  it('rejects duplicate username', async () => {
    await request(app).post('/api/v1/auth/register').send(valid);
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...valid, email: 'other@example.com' })
      .expect(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/username/i);
  });

  it('rejects password without uppercase letter', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...valid, email: 'b@b.com', username: 'bob', password: 'password1' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects password without a number', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...valid, email: 'c@c.com', username: 'carol', password: 'Password' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...valid, email: 'd@d.com', username: 'dave', password: 'Pa1' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing email', async () => {
    const { email: _e, ...noEmail } = valid;
    const res = await request(app).post('/api/v1/auth/register').send(noEmail).expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...valid, email: 'not-an-email', username: 'eve' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await createUser({ username: 'loginuser', email: 'login@example.com' });
  });

  it('logs in with correct credentials and returns a token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'TestPass123!' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.username).toBe('loginuser');
  });

  it('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'WrongPass1!' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects unknown email with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'TestPass123!' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing password with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid email format with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: 'TestPass123!' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('does not leak whether email exists (same 401 for both cases)', async () => {
    const wrongPass = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'WrongPass1!' });
    const noUser = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'TestPass123!' });

    expect(wrongPass.status).toBe(noUser.status);
    expect(wrongPass.body.message).toBe(noUser.body.message);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /verify-email
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/verify-email', () => {
  it('verifies email with a valid token', async () => {
    // Register to get a user with a verification token
    const regRes = await request(app).post('/api/v1/auth/register').send({
      username: 'verifyuser', email: 'verify@example.com',
      password: 'Password1', firstName: 'V', lastName: 'U',
    });
    expect(regRes.status).toBe(201);

    // Read the raw (un-hashed) token from the DB — it's stored hashed in the field
    // but getVerificationToken() returns the raw token.  We need to set it again.
    const user = await User.findOne({ email: 'verify@example.com' });
    const rawToken = user.getVerificationToken();
    await user.save(); // saves new hash

    const res = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ token: rawToken })
      .expect(200);

    expect(res.body.success).toBe(true);
    const updated = await User.findOne({ email: 'verify@example.com' });
    expect(updated.isVerified).toBe(true);
  });

  it('rejects an invalid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ token: 'invalidtoken12345' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a missing token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({})
      .expect(400);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /forgot-password
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/forgot-password', () => {
  it('responds 200 even for unknown email (prevents enumeration)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'nobody@nowhere.com' })
      .expect(200);
    expect(res.body.success).toBe(true);
  });

  it('responds 200 for a known email and saves reset token', async () => {
    const user = await createUser({ username: 'freset', email: 'freset@example.com' });

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'freset@example.com' })
      .expect(200);
    expect(res.body.success).toBe(true);

    const updated = await User.findById(user._id);
    expect(updated.resetPasswordToken).toBeTruthy();
    expect(updated.resetPasswordExpire.getTime()).toBeGreaterThan(Date.now());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /reset-password
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/reset-password', () => {
  let rawToken;
  let user;

  beforeEach(async () => {
    user = await createUser({ username: 'rpassuser', email: 'rpass@example.com' });
    rawToken = user.getResetPasswordToken();
    await user.save();
  });

  it('resets password with valid token and returns a new JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: rawToken, password: 'NewPass123!' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();

    // Verify the new password actually works
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'rpass@example.com', password: 'NewPass123!' });
    expect(loginRes.status).toBe(200);
  });

  it('rejects weak new password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: rawToken, password: 'weak' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: 'badtoken', password: 'NewPass123!' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /me
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/v1/auth/me', () => {
  let user, token;

  beforeEach(async () => {
    user  = await createUser({ username: 'meuser', email: 'me@example.com' });
    token = tokenFor(user);
  });

  it('returns current user for authenticated request', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe('meuser');
    expect(res.body.data.user.password).toBeUndefined(); // never exposed
  });

  it('returns 401 without auth token', async () => {
    await request(app).get('/api/v1/auth/me').expect(401);
  });

  it('returns 401 with a malformed token', async () => {
    await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer notAValidToken')
      .expect(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /update-details
// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/v1/auth/update-details', () => {
  let token;

  beforeEach(async () => {
    const user = await createUser({ username: 'upd8user', email: 'upd8@example.com' });
    token = tokenFor(user);
  });

  it('updates firstName and bio', async () => {
    const res = await request(app)
      .put('/api/v1/auth/update-details')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Updated', bio: 'New bio' })
      .expect(200);

    expect(res.body.data.user.firstName).toBe('Updated');
  });

  it('returns 401 without auth token', async () => {
    await request(app)
      .put('/api/v1/auth/update-details')
      .send({ firstName: 'Hacker' })
      .expect(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /update-password
// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /api/v1/auth/update-password', () => {
  let token;

  beforeEach(async () => {
    const user = await createUser({ username: 'pwduser', email: 'pwd@example.com' });
    token = tokenFor(user);
  });

  it('updates password with correct current password', async () => {
    const res = await request(app)
      .put('/api/v1/auth/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'NewPass456!' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
  });

  it('rejects wrong current password', async () => {
    const res = await request(app)
      .put('/api/v1/auth/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'WrongPass1!', newPassword: 'NewPass456!' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects same password as new password', async () => {
    const res = await request(app)
      .put('/api/v1/auth/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'TestPass123!' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects weak new password', async () => {
    const res = await request(app)
      .put('/api/v1/auth/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'TestPass123!', newPassword: 'weak' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 without auth token', async () => {
    await request(app)
      .put('/api/v1/auth/update-password')
      .send({ currentPassword: 'TestPass123!', newPassword: 'NewPass456!' })
      .expect(401);
  });
});
