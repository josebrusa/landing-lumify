/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/__tests__/**/*.vue',
    '**/*.spec.ts',
    '**/*.spec.vue',
    '**/*.test.ts',
    '**/*.test.vue',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@phosphor-icons/vue$': '<rootDir>/src/__mocks__/phosphor-icons-vue.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  setupFilesAfterEnv: [],
  globals: undefined,
};
