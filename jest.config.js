// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  clearMocks: true,
  setupFilesAfterEnv: ['./jest.setup.ts'], // Corrija para usar .ts
  transform: {
    '^.+\\.ts$': 'ts-jest', // Use ts-jest para transformar arquivos TypeScript
  },
  moduleFileExtensions: ['ts', 'js'],
  transformIgnorePatterns: ['/node_modules/'], // Ignore transformação em node_modules
};
