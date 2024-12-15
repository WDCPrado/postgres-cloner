"use client";

import { useState } from "react";
import { PostgresContainer } from "@/app/domain/interfaces/container-postgres";
import { ContainerCard } from "./container-card";
import { ContainerDialog } from "./container-dialog";

interface ContainersListProps {
  containers: PostgresContainer[];
}

export function ContainersList({ containers }: ContainersListProps) {
  const [search, setSearch] = useState("");

  const filteredContainers = containers.filter((container) =>
    container.containerName.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="p-8 w-screen max-w-full">
      <div className="flex justify-between items-center mb-8 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contenedores PostgreSQL
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus contenedores de PostgreSQL
          </p>
        </div>
        <ContainerDialog />
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 rounded-md border border-gray-300"
          placeholder="Buscar contenedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredContainers.map((container) => (
          <ContainerCard
            key={container.containerName}
            container={container}
            onDelete={handleDelete}
          />
        ))}
        {filteredContainers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-lg">
              No hay contenedores activos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
