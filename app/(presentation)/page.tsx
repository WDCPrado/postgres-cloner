export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Gestor de Contenedores PostgreSQL
        </h1>
        <p className="text-xl text-muted-foreground">
          Una herramienta simple pero poderosa para gestionar tus bases de datos
          PostgreSQL en contenedores Docker
        </p>
      </section>

      <div className="grid gap-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">¿Qué puedes hacer?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">
                Gestión de Contenedores
              </h3>
              <p className="text-muted-foreground">
                Crea, administra y elimina contenedores PostgreSQL con una
                interfaz intuitiva. Configura puertos, usuarios y contraseñas
                fácilmente.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">
                Clonación de Bases de Datos
              </h3>
              <p className="text-muted-foreground">
                Clona bases de datos desde cualquier origen PostgreSQL a tus
                contenedores locales de forma segura y eficiente.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cómo empezar</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium mb-1">Crear un Contenedor</h3>
                <p className="text-muted-foreground">
                  Ve a la sección &quot;Contenedores&quot; y crea un nuevo
                  contenedor PostgreSQL especificando nombre, puertos y
                  credenciales.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium mb-1">Gestionar Bases de Datos</h3>
                <p className="text-muted-foreground">
                  Una vez creado el contenedor, podrás ver sus bases de datos y
                  gestionar sus conexiones.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium mb-1">Clonar Bases de Datos</h3>
                <p className="text-muted-foreground">
                  Utiliza la función de clonación para copiar bases de datos
                  existentes a tus contenedores locales.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Requisitos</h2>
          <div className="p-6 border rounded-lg space-y-3">
            <p className="text-muted-foreground">
              Para utilizar esta aplicación necesitas tener instalado:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Docker Desktop o Docker Engine</li>
              <li>PostgreSQL Client Tools (para operaciones de clonación)</li>
              <li>Acceso a los puertos necesarios en tu sistema</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
