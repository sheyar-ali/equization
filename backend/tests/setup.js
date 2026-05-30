/**
 * tests/setup.js  — loaded via setupFilesAfterEnv (once per test file).
 *
 * Starts a fresh MongoMemoryServer per test file, disconnects any existing
 * connection first so multiple files can run in the same process (--runInBand).
 */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

beforeAll(async () => {
  // Disconnect any lingering connection from a previous test file
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  // Isolate tests — wipe every collection between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
