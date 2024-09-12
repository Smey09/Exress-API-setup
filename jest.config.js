module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  testMatch: ["**/__tests__/**/*.(spec|test).ts?(x)"], // Pattern to locate test files
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Alias for '@' in imports
  },
  coverageDirectory: "coverage",
};
