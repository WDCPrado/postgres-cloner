import {
  CloneResult,
  DatabaseCloner,
  DatabaseDestination,
  DatabaseSource,
} from "../../domain/interfaces/database-cloner";
import { ContainerOperations } from "../../domain/interfaces/container-postgres";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export class DatabaseClonerRepository implements DatabaseCloner {
  private progress: number = 0;

  constructor(private containerOperations: ContainerOperations) {}

  async cloneDatabase(
    source: DatabaseSource,
    destination: DatabaseDestination
  ): Promise<CloneResult> {
    try {
      const destinationContainer =
        await this.containerOperations.buscarContenedor(
          destination.containerName
        );

      if (!destinationContainer) {
        throw new Error("Contenedor destino no encontrado");
      }

      const tempDumpFile = `temp_${Date.now()}.dump`;

      try {
        // Crear la base de datos destino primero
        console.log("Creando base de datos destino...");
        const createDbCommand = `PGPASSWORD="${destinationContainer.environment.POSTGRES_PASSWORD}" createdb -h localhost -p ${destinationContainer.environment.POSTGRES_PORT} -U ${destinationContainer.environment.POSTGRES_USER} ${destination.database}`;

        try {
          await execPromise(
            `docker exec ${destinationContainer.containerName} /bin/bash -c "${createDbCommand}"`
          );
        } catch (createError: any) {
          // Ignorar error si la base de datos ya existe
          if (!createError.message.includes("already exists")) {
            throw createError;
          }
        }

        // Ajustar el host para acceso desde Docker
        const sourceHost =
          source.host === "localhost" ? "host.docker.internal" : source.host;

        // Comando de backup con formato personalizado
        this.progress = 25;
        console.log("Iniciando backup...");
        const dumpCommand = `PGPASSWORD="${source.password}" pg_dump -h ${sourceHost} -p ${source.port} -U ${source.user} -d ${source.database} -F c -f /${tempDumpFile}`;

        // Ejecutar backup
        const { stderr: dumpError } = await execPromise(
          `docker exec ${destinationContainer.containerName} /bin/bash -c "${dumpCommand}"`
        );

        if (dumpError && !dumpError.includes("warning:")) {
          console.error("Error en backup:", dumpError);
          throw new Error(`Error en backup: ${dumpError}`);
        }

        this.progress = 50;

        // Verificar archivo de backup
        await execPromise(
          `docker exec ${destinationContainer.containerName} ls -l /${tempDumpFile}`
        );

        // Primero, limpiar la base de datos destino
        console.log("Limpiando base de datos destino...");
        const cleanDbCommand = `PGPASSWORD="${destinationContainer.environment.POSTGRES_PASSWORD}" psql -h localhost -p ${destinationContainer.environment.POSTGRES_PORT} -U ${destinationContainer.environment.POSTGRES_USER} -d ${destination.database} -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'`;

        await execPromise(
          `docker exec ${destinationContainer.containerName} /bin/bash -c "${cleanDbCommand}"`
        );

        // Comando de restauración modificado
        console.log("Iniciando restauración...");
        const restoreCommand = `PGPASSWORD="${destinationContainer.environment.POSTGRES_PASSWORD}" pg_restore -h localhost -p ${destinationContainer.environment.POSTGRES_PORT} -U ${destinationContainer.environment.POSTGRES_USER} -d ${destination.database} --clean --if-exists --no-owner --no-privileges --no-comments --disable-triggers /${tempDumpFile}`;

        // Ejecutar restauración
        this.progress = 75;
        const { stderr: restoreError } = await execPromise(
          `docker exec ${destinationContainer.containerName} /bin/bash -c "${restoreCommand}"`
        );

        if (restoreError && !restoreError.includes("warning:")) {
          console.error("Error en restauración:", restoreError);
          throw new Error(`Error en restauración: ${restoreError}`);
        }

        // Limpiar archivo temporal
        console.log("Limpiando archivos temporales...");
        await execPromise(
          `docker exec ${destinationContainer.containerName} rm -f /${tempDumpFile}`
        );

        this.progress = 100;

        return {
          success: true,
          message: "Clonación completada exitosamente",
          details: {
            tablesCopied: -1,
            recordsCopied: -1,
            totalTime: "N/A",
          },
        };
      } catch (error: any) {
        // Limpieza en caso de error
        try {
          await execPromise(
            `docker exec ${destinationContainer.containerName} rm -f /${tempDumpFile}`
          );
        } catch (cleanupError) {
          console.error("Error al limpiar archivo temporal:", cleanupError);
        }
        throw new Error(`Error durante la clonación: ${error.message}`);
      }
    } catch (error: any) {
      this.progress = 0;
      return {
        success: false,
        message: `Error en la clonación: ${error.message}`,
      };
    }
  }

  async verifyDestinationContainer(containerName: string): Promise<boolean> {
    try {
      const container = await this.containerOperations.buscarContenedor(
        containerName
      );
      return container !== null;
    } catch (error) {
      console.error("Error al verificar el contenedor:", error);
      return false;
    }
  }

  getProgress(): number {
    return this.progress;
  }

  async cancelClone(): Promise<void> {
    this.progress = 0;
  }
}
