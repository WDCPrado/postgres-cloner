import { DockerPostgresRepository } from "../infrastructure/repositories/container-postgres-repositories";
import { PostgresContainerUseCases } from "../application/use-cases/container-postgres-use-cases";

// Crear una instancia del repositorio
const containerRepository = new DockerPostgresRepository();

// Crear una instancia del caso de uso con el repositorio inyectado
const postgresContainerUseCases = new PostgresContainerUseCases(
  containerRepository
);

// Exportar el caso de uso
export { postgresContainerUseCases };
