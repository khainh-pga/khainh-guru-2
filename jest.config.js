/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: '@shelf/jest-dynamodb',
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  transform: {'^.+\\.tsx?|.ts?$': 'ts-jest'}
};