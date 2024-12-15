/**
 * Configuración para la base de datos origen
 */
export interface DatabaseSource {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

/**
 * Configuración para la base de datos destino
 */
export interface DatabaseDestination {
  containerName: string;
  database: string;
}

/**
 * Resultado de la operación de clonación
 */
export interface CloneResult {
  success: boolean;
  message: string;
  details?: {
    tablesCopied: number;
    recordsCopied: number;
    totalTime: string;
  };
}

/**
 * Interfaz para el servicio de clonación
 */
export interface DatabaseCloner {
  /**
   * Clona una base de datos desde un origen a un contenedor local
   * @param source Configuración de la base de datos origen
   * @param destination Configuración de la base de datos destino
   */
  cloneDatabase(
    source: DatabaseSource,
    destination: DatabaseDestination
  ): Promise<CloneResult>;

  /**
   * Verifica si un contenedor está disponible para recibir la clonación
   * @param containerName Nombre del contenedor a verificar
   */
  verifyDestinationContainer(containerName: string): Promise<boolean>;

  /**
   * Obtiene el progreso actual de la clonación
   * @returns Porcentaje de progreso (0-100)
   */
  getProgress(): number;

  /**
   * Cancela una operación de clonación en curso
   */
  cancelClone(): Promise<void>;
}
