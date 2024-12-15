/**
 * Configuración básica de Postgres para el contenedor
 */
export interface PostgresConfig {
  POSTGRES_USER: string; // Nombre de usuario para PostgreSQL
  POSTGRES_PASSWORD: string; // Contraseña para PostgreSQL
  POSTGRES_DB: string; // Nombre de la base de datos
  POSTGRES_PORT: number; // Puerto en el host
  POSTGRES_HOST: string; // Dirección del host
}

/**
 * Configuración de volúmenes para el contenedor Docker
 */
export interface PostgresVolume {
  source: string; // Ruta local del volumen en el host
  target: string; // Ruta dentro del contenedor Docker
}

/**
 * Configuración de un contenedor Docker que ejecuta PostgreSQL
 */
export interface PostgresContainer {
  containerName: string; // Nombre del contenedor Docker
  image: string; // Imagen de Docker utilizada (e.g., "postgres:latest")
  ports: {
    host: number; // Puerto expuesto en el host
    container: number; // Puerto interno del contenedor Docker
  };
  environment: PostgresConfig; // Variables de entorno necesarias para PostgreSQL
  volumes?: PostgresVolume[]; // Configuración opcional de volúmenes
}

/**
 * Operaciones relacionadas con la gestión de contenedores Docker
 */
export interface ContainerOperations {
  /**
   * Crear un contenedor de Docker basado en la configuración proporcionada
   * @param config Configuración del contenedor PostgreSQL
   */
  crearContenedor(config: PostgresContainer): Promise<void>;

  /**
   * Buscar un contenedor Docker PostgreSQL por su nombre
   * @param nombreContenedor Nombre del contenedor a buscar
   * @returns Configuración del contenedor encontrado o `null` si no existe
   */
  buscarContenedor(nombreContenedor: string): Promise<PostgresContainer | null>;

  /**
   * Eliminar un contenedor Docker PostgreSQL por su nombre
   * @param nombreContenedor Nombre del contenedor a eliminar
   */
  eliminarContenedor(nombreContenedor: string): Promise<void>;

  /**
   * Listar todos los contenedores PostgreSQL activos
   * @returns Lista de contenedores activos con detalles básicos
   */
  listarContenedores(): Promise<PostgresContainer[]>;
}
