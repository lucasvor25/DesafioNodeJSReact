import type { Config } from 'jest';

const config: Config = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts?(x)'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    testEnvironment: 'jsdom',
};

export default config;