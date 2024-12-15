import { postgresContainerUseCases } from "@/app/inyections";
import Docker from "dockerode";

describe("Integración de PostgresContainerUseCases", () => {
  const docker = new Docker();
  const testContainerName = "test-container-integration";

  const delay = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  afterAll(async () => {
    console.log("Test finalizado");
  });

  it("debería crear un contenedor PostgreSQL", async () => {
    const config = {
      containerName: testContainerName,
      image: "postgres:latest",
      ports: { host: 5433, container: 5432 },
      environment: {
        POSTGRES_USER: "test",
        POSTGRES_PASSWORD: "password",
        POSTGRES_DB: "testdb",
        POSTGRES_PORT: 5432,
        POSTGRES_HOST: "localhost",
      },
    };

    // Crear el contenedor usando el caso de uso
    await postgresContainerUseCases.createContainer(config);
    await delay(2000); // Esperar 2 segundos después de crear

    // Verificar que el contenedor existe en Docker
    const containers = await docker.listContainers({ all: true });
    const createdContainer = containers.find((c) =>
      c.Names.includes(`/${testContainerName}`)
    );

    expect(createdContainer).toBeDefined();
    expect(createdContainer?.Image).toContain("postgres");
  });

  it("debería buscar un contenedor PostgreSQL por su nombre", async () => {
    await delay(2000); // Esperar 2 segundos para evitar conflictos
    const foundContainer = await postgresContainerUseCases.findContainer(
      testContainerName
    );

    expect(foundContainer).toBeDefined();
    expect(foundContainer?.containerName).toBe(testContainerName);
    expect(foundContainer?.image).toContain("postgres");
  });

  it("debería listar todos los contenedores PostgreSQL activos", async () => {
    await delay(2000); // Esperar 2 segundos para evitar conflictos
    const containers = await postgresContainerUseCases.listContainers();

    const createdContainer = containers.find(
      (c) => c.containerName === testContainerName
    );

    expect(containers.length).toBeGreaterThan(0);
    expect(createdContainer).toBeDefined();
    expect(createdContainer?.image).toContain("postgres");
  });

  it("debería eliminar un contenedor PostgreSQL por su nombre", async () => {
    await delay(2000); // Esperar 2 segundos para evitar conflictos
    await postgresContainerUseCases.deleteContainer(testContainerName);
    await delay(2000); // Esperar 2 segundos después de eliminar

    const containers = await docker.listContainers({ all: true });
    const deletedContainer = containers.find((c) =>
      c.Names.includes(`/${testContainerName}`)
    );

    expect(deletedContainer).toBeUndefined();
  });
});
