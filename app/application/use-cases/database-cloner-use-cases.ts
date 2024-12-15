/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CloneResult,
  DatabaseCloner,
  DatabaseSource,
  DatabaseDestination,
} from "@/app/domain/interfaces/database-cloner";

export class DatabaseClonerUseCases {
  constructor(private clonerRepository: DatabaseCloner) {}

  /**
   * Inicia el proceso de clonación de una base de datos
   */
  async cloneDatabase(
    source: DatabaseSource,
    destination: DatabaseDestination
  ): Promise<CloneResult> {
    try {
      this.validateSourceData(source);
      this.validateDestinationData(destination);
      return await this.clonerRepository.cloneDatabase(source, destination);
    } catch (error: any) {
      throw new Error(`Error en el proceso de clonación: ${error.message}`);
    }
  }

  /**
   * Obtiene el progreso actual de la clonación
   */
  getProgress(): number {
    return this.clonerRepository.getProgress();
  }

  /**
   * Cancela la operación de clonación en curso
   */
  async cancelClone(): Promise<void> {
    await this.clonerRepository.cancelClone();
  }

  /**
   * Verifica si un contenedor está disponible para la clonación
   */
  async verifyDestinationContainer(containerName: string): Promise<boolean> {
    return await this.clonerRepository.verifyDestinationContainer(
      containerName
    );
  }

  private validateSourceData(source: DatabaseSource): void {
    if (!source.host) throw new Error("El host de origen es requerido");
    if (!source.port) throw new Error("El puerto de origen es requerido");
    if (!source.database)
      throw new Error("El nombre de la base de datos es requerido");
    if (!source.user) throw new Error("El usuario es requerido");
    if (!source.password) throw new Error("La contraseña es requerida");
  }

  private validateDestinationData(destination: DatabaseDestination): void {
    if (!destination.containerName)
      throw new Error("El nombre del contenedor destino es requerido");
    if (!destination.database)
      throw new Error("El nombre de la base de datos destino es requerido");
  }
}
