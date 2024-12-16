// Aumentar el timeout global para pruebas de integración
jest.setTimeout(30000);

// Silenciar logs de consola durante las pruebas
global.console = {
  ...console,
  // Mantener error para debugging
  error: jest.fn(),
  // Silenciar logs informativos
  log: jest.fn(),
  // Silenciar warnings
  warn: jest.fn(),
  // Mantener info pero como mock
  info: jest.fn(),
};

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});

// Manejar errores no capturados durante las pruebas
process.on("unhandledRejection", (error) => {
  console.error("Error no manejado durante las pruebas:", error);
});
