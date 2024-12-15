/* eslint-disable @typescript-eslint/no-explicit-any */
import Docker from "dockerode";
import {
  ContainerOperations,
  PostgresContainer,
} from "../../domain/interfaces/container-postgres";

/**
 * Repositorio que implementa las operaciones de contenedores PostgreSQL utilizando Docker
 */
export class DockerPostgresRepository implements ContainerOperations {
  private docker: Docker;

  constructor() {
    this.docker = new Docker(); // Inicializa el cliente Docker
  }

  /**
   * Crear un contenedor de Docker basado en la configuración proporcionada
   * @param config Configuración del contenedor PostgreSQL
   */
  async crearContenedor(config: PostgresContainer): Promise<void> {
    const { containerName, image, ports, environment, volumes } = config;

    console.log(config);
    const envVariables = [
      `POSTGRES_USER=${environment.POSTGRES_USER}`,
      `POSTGRES_PASSWORD=${environment.POSTGRES_PASSWORD}`,
      `POSTGRES_DB=${environment.POSTGRES_DB}`,
    ];

    const binds =
      volumes?.map((volume) => `${volume.source}:${volume.target}`) || [];

    try {
      const container = await this.docker.createContainer({
        Image: image,
        name: containerName,
        Env: envVariables,
        HostConfig: {
          PortBindings: {
            [`${ports.container}/tcp`]: [{ HostPort: ports.host.toString() }],
          },
          Binds: binds,
        },
      });

      await container.start();
      console.log(
        `Contenedor ${containerName} creado y iniciado exitosamente.`
      );
    } catch (error) {
      console.error(`Error al crear el contenedor ${containerName}:`, error);
      throw error;
    }
  }

  /**
   * Buscar un contenedor Docker PostgreSQL por su nombre
   * @param nombreContenedor Nombre del contenedor a buscar
   * @returns Configuración del contenedor encontrado o `null` si no existe
   */
  async buscarContenedor(
    nombreContenedor: string
  ): Promise<PostgresContainer | null> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const containerInfo = containers.find((container: any) =>
        container.Names.some((name: any) => name === `/${nombreContenedor}`)
      );

      if (!containerInfo) return null;

      const container = this.docker.getContainer(containerInfo.Id);
      const inspectData = await container.inspect();

      return {
        containerName: nombreContenedor,
        image: inspectData.Config.Image,
        ports: {
          host: containerInfo.Ports[0]?.PublicPort || 0,
          container: containerInfo.Ports[0]?.PrivatePort || 0,
        },
        environment: {
          POSTGRES_USER:
            inspectData.Config.Env.find((env: any) =>
              env.startsWith("POSTGRES_USER=")
            )?.split("=")[1] || "",
          POSTGRES_PASSWORD:
            inspectData.Config.Env.find((env: any) =>
              env.startsWith("POSTGRES_PASSWORD=")
            )?.split("=")[1] || "",
          POSTGRES_DB:
            inspectData.Config.Env.find((env: any) =>
              env.startsWith("POSTGRES_DB=")
            )?.split("=")[1] || "",
          POSTGRES_PORT: 5432,
          POSTGRES_HOST: "localhost",
        },
      };
    } catch (error) {
      console.error(
        `Error al buscar el contenedor ${nombreContenedor}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Eliminar un contenedor Docker PostgreSQL por su nombre
   * @param nombreContenedor Nombre del contenedor a eliminar
   */
  async eliminarContenedor(nombreContenedor: string): Promise<void> {
    try {
      const container = this.docker.getContainer(nombreContenedor);
      await container.stop();
      await container.remove();
      console.log(`Contenedor ${nombreContenedor} eliminado exitosamente.`);
    } catch (error) {
      console.error(
        `Error al eliminar el contenedor ${nombreContenedor}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Listar todos los contenedores PostgreSQL activos
   * @returns Lista de contenedores activos con detalles básicos
   */
  async listarContenedores(): Promise<PostgresContainer[]> {
    try {
      const containers = await this.docker.listContainers();
      return containers.map((container: any) => ({
        containerName: container.Names[0]?.replace("/", ""),
        image: container.Image,
        ports: {
          host: container.Ports[0]?.PublicPort || 0,
          container: container.Ports[0]?.PrivatePort || 0,
        },
        environment: {
          POSTGRES_USER: "", // Estas variables requieren inspección adicional
          POSTGRES_PASSWORD: "",
          POSTGRES_DB: "",
          POSTGRES_PORT: 5432,
          POSTGRES_HOST: "localhost",
        },
      }));
    } catch (error) {
      console.error("Error al listar los contenedores:", error);
      throw error;
    }
  }
}
