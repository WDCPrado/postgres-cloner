module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // O "jsdom" si pruebas lógica de frontend
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Ajustar testMatch para que Jest busque únicamente dentro de /tests
  testMatch: ["<rootDir>/tests/**/*.spec.ts", "<rootDir>/tests/**/*.test.ts"],
  testTimeout: 30000,
};
