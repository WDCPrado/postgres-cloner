// app/(presentation)/containers/components/containers-list.tsx
"use client";

import { PostgresContainer } from "@/app/domain/interfaces/container-postgres";
import { ContainerCard } from "./container-card";
import { ContainerDialog } from "./container-dialog";

interface ContainersListProps {
  containers: PostgresContainer[];
}

export function ContainersList({ containers }: ContainersListProps) {
  const handleDelete = async (containerName: string) => {
    try {
      const response = await fetch(`/api/containers?name=${containerName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el contenedor");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contenedores PostgreSQL</h1>
        <ContainerDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map((container) => (
          <ContainerCard
            key={container.containerName}
            container={container}
            onDelete={handleDelete}
          />
        ))}
        {containers.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No hay contenedores activos
          </div>
        )}
      </div>
    </div>
  );
}
