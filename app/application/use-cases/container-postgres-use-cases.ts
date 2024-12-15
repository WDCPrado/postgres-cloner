import {
  ContainerOperations,
  PostgresContainer,
} from "../../domain/interfaces/container-postgres";

/**
 * Caso de uso: Gestión de contenedores PostgreSQL
 * Este caso de uso encapsula las operaciones relacionadas con contenedores:
 * - Crear
 * - Buscar
 * - Listar
 * - Eliminar
 */
export class PostgresContainerUseCases {
  private containerOperations: ContainerOperations;

  constructor(containerOperations: ContainerOperations) {
    this.containerOperations = containerOperations; // Inyección de dependencias
  }

  /**
   * Crear un nuevo contenedor PostgreSQL
   * @param config Configuración del contenedor PostgreSQL
   */
  async createContainer(config: PostgresContainer): Promise<void> {
    if (!config.containerName || !config.image) {
      throw new Error("El nombre del contenedor y la imagen son obligatorios.");
    }
    if (!config.ports.host || !config.ports.container) {
      throw new Error("Los puertos host y container son obligatorios.");
    }
    console.log(`Creando el contenedor: ${config.containerName}`);
    await this.containerOperations.crearContenedor(config);
    console.log(`Contenedor ${config.containerName} creado exitosamente.`);
  }

  /**
   * Buscar un contenedor PostgreSQL por su nombre
   * @param containerName Nombre del contenedor a buscar
   * @returns Configuración del contenedor o null si no existe
   */
  async findContainer(
    containerName: string
  ): Promise<PostgresContainer | null> {
    if (!containerName) {
      throw new Error("El nombre del contenedor es obligatorio para buscarlo.");
    }

    const container = await this.containerOperations.buscarContenedor(
      containerName
    );
    if (!container) {
      console.log(`El contenedor ${containerName} no existe.`);
    }
    return container;
  }

  /**
   * Listar todos los contenedores PostgreSQL activos
   * @returns Lista de contenedores activos
   */
  async listContainers(): Promise<PostgresContainer[]> {
    const containers = await this.containerOperations.listarContenedores();
    if (!containers.length) {
      console.log("No se encontraron contenedores activos.");
    }
    return containers;
  }

  /**
   * Eliminar un contenedor PostgreSQL por su nombre
   * @param containerName Nombre del contenedor a eliminar
   */
  async deleteContainer(containerName: string): Promise<void> {
    if (!containerName) {
      throw new Error(
        "El nombre del contenedor es obligatorio para eliminarlo."
      );
    }

    console.log(`Eliminando el contenedor: ${containerName}`);
    await this.containerOperations.eliminarContenedor(containerName);
    console.log(`Contenedor ${containerName} eliminado exitosamente.`);
  }

  /**
   * Listar todas las bases de datos en un contenedor específico
   * @param containerName Nombre del contenedor
   * @returns Lista de nombres de bases de datos
   */
  async listDatabases(containerName: string): Promise<string[]> {
    if (!containerName) {
      throw new Error("El nombre del contenedor es requerido");
    }

    try {
      const databases = await this.containerOperations.listarBasesDeDatos(
        containerName
      );
      return databases;
    } catch (error: any) {
      console.error(`Error al listar bases de datos: ${error.message}`);
      throw error;
    }
  }
}
