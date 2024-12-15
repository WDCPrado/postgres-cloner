/* eslint-disable @typescript-eslint/no-explicit-any */
import Docker from "dockerode";
import {
  ContainerOperations,
  PostgresContainer,
} from "../../domain/interfaces/container-postgres";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

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

      // Extraer las variables de entorno
      const envVars = inspectData.Config.Env.reduce((acc: any, env: string) => {
        const [key, value] = env.split("=");
        acc[key] = value;
        return acc;
      }, {});

      // Convertir explícitamente los puertos a número
      const hostPort = containerInfo.Ports[0]?.PublicPort
        ? Number(containerInfo.Ports[0].PublicPort)
        : 5432;
      const containerPort = containerInfo.Ports[0]?.PrivatePort
        ? Number(containerInfo.Ports[0].PrivatePort)
        : 5432;

      return {
        containerName: nombreContenedor,
        image: inspectData.Config.Image,
        ports: {
          host: hostPort,
          container: containerPort,
        },
        environment: {
          POSTGRES_USER: envVars.POSTGRES_USER || "postgres",
          POSTGRES_PASSWORD: envVars.POSTGRES_PASSWORD || "postgres",
          POSTGRES_DB: envVars.POSTGRES_DB || "postgres",
          POSTGRES_PORT: Number(envVars.POSTGRES_PORT) || 5432,
          POSTGRES_HOST: envVars.POSTGRES_HOST || "localhost",
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
      const containerDetails = await Promise.all(
        containers.map(async (container: any) => {
          const containerName = container.Names[0]?.replace("/", "");
          return await this.buscarContenedor(containerName);
        })
      );

      return containerDetails.filter(
        (container): container is PostgresContainer => container !== null
      );
    } catch (error) {
      console.error("Error al listar los contenedores:", error);
      throw error;
    }
  }

  async listarBasesDeDatos(containerName: string): Promise<string[]> {
    try {
      const container = await this.buscarContenedor(containerName);
      if (!container) {
        throw new Error(`Contenedor ${containerName} no encontrado`);
      }

      const comando = `PGPASSWORD="${container.environment.POSTGRES_PASSWORD}" psql -h localhost -p ${container.ports.container} -U ${container.environment.POSTGRES_USER} -l -t | cut -d'|' -f1 | sed -e 's/ //g' -e '/^$/d'`;

      const { stdout } = await execPromise(
        `docker exec ${containerName} /bin/bash -c "${comando}"`
      );

      // Filtrar bases de datos del sistema
      const databaseList = stdout
        .split("\n")
        .map((db: any) => db.trim())
        .filter((db: any) => db && !["template0", "template1"].includes(db));

      return databaseList;
    } catch (error: any) {
      console.error(
        `Error al listar bases de datos del contenedor ${containerName}:`,
        error
      );
      throw new Error(`Error al listar bases de datos: ${error.message}`);
    }
  }
}
