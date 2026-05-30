/** @type {import('jest').Config} */
module.exports = {
  testEnvironment:      'node',
  testMatch:            ['**/tests/**/*.test.js'],
  setupFilesAfterEnv:   ['<rootDir>/tests/setup.js'],
  maxWorkers:           1,       // serialize — single MongoMemoryServer
  testTimeout:          25000,   // socket tests need extra time
  forceExit:            true,    // don't hang on open socket handles
  verbose:              true,
};
