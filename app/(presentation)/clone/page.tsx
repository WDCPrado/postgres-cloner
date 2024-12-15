// app/(presentation)/clone/page.tsx
import { postgresContainerUseCases } from "@/app/inyections";
import { CloneForm } from "./components/clone-form";

export const dynamic = "force-dynamic";

export default async function ClonePage() {
  const containers = await postgresContainerUseCases.listContainers();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Clonar Base de Datos
        </h1>
        <p className="text-muted-foreground mt-1">
          Clona una base de datos existente a un contenedor local
        </p>
      </div>
      <CloneForm availableContainers={containers} />
    </div>
  );
}
