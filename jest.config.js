const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleFileExtensions: ["ts", "js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/controllers/**/*.ts",
    "src/services/**/*.ts",
    "src/database/**/*.ts",
  ],
  setupFiles: ["<rootDir>/jest.setup.ts"],
};

