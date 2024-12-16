const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  testMatch: [
    "<rootDir>/tests/pending/**/*.spec.ts",
    "<rootDir>/tests/pending/**/*.test.ts",
  ],
  testTimeout: 30000,
  watchPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/.git/",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/.git/",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};

module.exports = createJestConfig(customJestConfig);
