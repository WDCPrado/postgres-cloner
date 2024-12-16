import { databaseClonerUseCases } from "@/app/inyections";
import Docker from "dockerode";

describe("Integración de DatabaseClonerUseCases", () => {
  const docker = new Docker({
    socketPath:
      process.platform === "win32"
        ? "//./pipe/docker_engine"
        : "/var/run/docker.sock",
  });
  const testContainerName = "test-cloner-container";
  const testDatabase = "test_clone_db";

  const delay = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  beforeAll(async () => {
    // Configuración inicial del contenedor de prueba
    const config = {
      containerName: testContainerName,
      image: "postgres:latest",
      ports: { host: 5434, container: 5432 },
      environment: {
        POSTGRES_USER: "test",
        POSTGRES_PASSWORD: "password",
        POSTGRES_DB: "postgres",
        POSTGRES_PORT: 5432,
        POSTGRES_HOST: "localhost",
      },
    };

    // Crear contenedor de prueba
    const container = await docker.createContainer({
      Image: config.image,
      name: config.containerName,
      Env: [
        `POSTGRES_USER=${config.environment.POSTGRES_USER}`,
        `POSTGRES_PASSWORD=${config.environment.POSTGRES_PASSWORD}`,
        `POSTGRES_DB=${config.environment.POSTGRES_DB}`,
      ],
      HostConfig: {
        PortBindings: {
          "5432/tcp": [{ HostPort: "5434" }],
        },
      },
    });

    await container.start();
    await delay(2000); // Esperar a que el contenedor esté listo
  });

  afterAll(async () => {
    // Limpiar el contenedor de prueba
    try {
      const container = docker.getContainer(testContainerName);
      await container.stop();
      await container.remove();
    } catch (error) {
      console.error("Error al limpiar el contenedor:", error);
    }
  });

  it("debería verificar si un contenedor destino existe", async () => {
    const exists = await databaseClonerUseCases.verifyDestinationContainer(
      testContainerName
    );
    expect(exists).toBe(true);

    const nonExistentContainer =
      await databaseClonerUseCases.verifyDestinationContainer(
        "contenedor-inexistente"
      );
    expect(nonExistentContainer).toBe(false);
  });

  it("debería obtener el progreso de clonación", () => {
    const progress = databaseClonerUseCases.getProgress();
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  it("debería clonar una base de datos", async () => {
    const source = {
      host: "localhost",
      port: 5434,
      database: "postgres",
      user: "test",
      password: "password",
    };

    const destination = {
      containerName: testContainerName,
      database: testDatabase,
    };

    const result = await databaseClonerUseCases.cloneDatabase(
      source,
      destination
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toContain("Clonación completada exitosamente");
  });

  it("debería manejar errores al clonar con datos inválidos", async () => {
    const invalidSource = {
      host: "invalid-host",
      port: 1234,
      database: "invalid-db",
      user: "invalid-user",
      password: "invalid-password",
    };

    const destination = {
      containerName: testContainerName,
      database: "test_error_db",
    };

    const result = await databaseClonerUseCases.cloneDatabase(
      invalidSource,
      destination
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.message).toContain("Error");
  });

  it("debería cancelar una operación de clonación", async () => {
    await databaseClonerUseCases.cancelClone();
    const progress = databaseClonerUseCases.getProgress();
    expect(progress).toBe(0);
  });

  it("debería fallar al clonar a un contenedor inexistente", async () => {
    const source = {
      host: "localhost",
      port: 5434,
      database: "postgres",
      user: "test",
      password: "password",
    };

    const destination = {
      containerName: "contenedor-inexistente",
      database: "test_db",
    };

    const result = await databaseClonerUseCases.cloneDatabase(
      source,
      destination
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.message).toContain("Contenedor destino no encontrado");
  });
});
