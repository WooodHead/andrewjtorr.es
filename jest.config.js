'use strict'

const { defaults } = require('jest-config')

module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts?(x)',
    '!src/components/**/graphql.ts',
    '!src/components/html/index.tsx',
    '!src/store/index.ts',
    '!src/client.tsx',
    '!src/config.ts',
    '!src/server.tsx',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
  errorOnDeprecated: true,
  globals: { __IS_DEV__: false },
  moduleDirectories: [...defaults.moduleDirectories, '<rootDir>/src'],
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/config/jest/setup.ts'],
  snapshotResolver: '<rootDir>/config/jest/snapshot-resolver.js',
  testMatch: ['<rootDir>/src/**/*(*.)test.ts?(x)'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^(?!.*\\.(js|json|ts(x)?)$)': '<rootDir>/config/jest/file-transformer.js',
    '^.+\\.ts(x)?$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.js$'],
}
