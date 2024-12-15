module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", // Puedes usar "jsdom" si estás probando lógica del frontend
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1", // Soporte para paths si usas tsconfig.json con aliases
  },
  testMatch: ["**/*.spec.ts", "**/*.test.ts"], // Ubicación de los archivos de test
  testTimeout: 30000, // Aumenta el timeout a 30 segundos
};
