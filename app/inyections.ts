import { DockerPostgresRepository } from "./infrastructure/repositories/container-postgres-repositories";
import { PostgresContainerUseCases } from "./application/use-cases/container-postgres-use-cases";
import { DatabaseClonerRepository } from "./infrastructure/repositories/database-cloner-repositorie";
import { DatabaseClonerUseCases } from "./application/use-cases/database-cloner-use-cases";

// Crear una instancia del repositorio para contenedores
const containerRepository = new DockerPostgresRepository();

// Crear una instancia del caso de uso para contenedores con el repositorio inyectado
const postgresContainerUseCases = new PostgresContainerUseCases(
  containerRepository
);

// Crear una instancia del repositorio para la clonación de bases de datos
const databaseClonerRepository = new DatabaseClonerRepository(
  containerRepository
);

// Crear una instancia del caso de uso para la clonación de bases de datos con el repositorio inyectado
const databaseClonerUseCases = new DatabaseClonerUseCases(
  databaseClonerRepository
);

// Exportar los casos de uso
export { postgresContainerUseCases, databaseClonerUseCases };
