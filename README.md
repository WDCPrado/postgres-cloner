# Database Cloner

Database Cloner es una aplicación web que permite gestionar y clonar bases de datos de manera sencilla utilizando contenedores Docker. Actualmente soporta PostgreSQL, con planes futuros para expandir a otros motores de bases de datos.

## Características

- Gestión de contenedores Docker para bases de datos
- Creación y eliminación de contenedores PostgreSQL
- Clonación de bases de datos entre contenedores
- Interfaz intuitiva y moderna
- Soporte para tema claro/oscuro

## Requisitos Previos

- [Docker](https://www.docker.com/get-started) instalado y en ejecución
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [PostgreSQL Client Tools](https://www.postgresql.org/download/) instaladas localmente

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/database-cloner.git
cd database-cloner
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Guía de Uso

### 1. Crear un Contenedor

1. Ve a la sección "Contenedores"
2. Haz clic en "Nuevo Contenedor"
3. Completa el formulario con:
   - Nombre del contenedor
   - Imagen (por defecto postgres:latest)
   - Puerto del host
   - Credenciales de PostgreSQL
4. Haz clic en "Crear"

### 2. Gestionar Bases de Datos

1. En la lista de contenedores, localiza el contenedor deseado
2. Haz clic en "Bases de Datos" para ver las bases existentes
3. Puedes copiar las cadenas de conexión haciendo clic en "Copiar"

### 3. Clonar una Base de Datos

1. En el diálogo de bases de datos, completa:
   - URL de conexión de la base de datos origen
   - Nombre para la nueva base de datos
2. Haz clic en "Iniciar Clonación"
3. Monitorea el progreso en tiempo real

## Estructura del Proyecto

```bash
database-cloner/
├── app/
│ ├── (presentation)/ # Componentes de presentación
│ ├── application/ # Casos de uso
│ ├── domain/ # Interfaces y modelos
│ └── infrastructure/ # Implementaciones concretas
├── components/ # Componentes UI reutilizables
└── public/ # Archivos estáticos
```

## Próximas Características

- [ ] Soporte para múltiples motores de bases de datos
  - [ ] PostgreSQL
- [ ] Programación de tareas de clonación
- [ ] Respaldos automáticos
- [ ] Gestión de permisos y usuarios
- [ ] Métricas y monitoreo

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
