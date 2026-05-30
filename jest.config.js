/** @type {import('jest').Config} */
module.exports = {
  testEnvironment:      'jest-environment-jsdom',
  testMatch:            ['**/tests/unit/**/*.spec.js'],
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.js$':  'babel-jest',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  moduleNameMapper: {
    // Asset stubs MUST come before @/ mapping so @/assets/img.png is caught first
    '\\.(png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$': '<rootDir>/tests/unit/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv:   ['<rootDir>/tests/unit/setup.js'],
  verbose:              true,
  testTimeout:          10000,
  // jest 29: required for legacy Vue 2 / CommonJS modules
  extensionsToTreatAsEsm: [],
};
