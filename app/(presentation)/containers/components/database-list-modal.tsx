/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostgresContainer } from "@/app/domain/interfaces/container-postgres";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface DatabaseListModalProps {
  container: PostgresContainer;
  isOpen: boolean;
  onClose: () => void;
}

export function DatabaseListModal({
  container,
  isOpen,
  onClose,
}: DatabaseListModalProps) {
  const [databases, setDatabases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/containers/databases?container=${container.containerName}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al obtener las bases de datos");
        }

        setDatabases(data.databases);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDatabases();
    }
  }, [isOpen, container.containerName]);

  const getConnectionString = (dbName: string) => {
    const { POSTGRES_USER, POSTGRES_PASSWORD } = container.environment;
    const { host: port } = container.ports;
    return `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${port}/${dbName}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Bases de Datos en {container.containerName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {databases.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No se encontraron bases de datos
              </p>
            ) : (
              databases.map((db) => (
                <div
                  key={db}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{db}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                      Puerto: {container.ports.host}
                    </span>
                  </div>
                  <div className="relative group">
                    <pre className="p-2 bg-muted rounded text-sm overflow-x-auto">
                      <code>{getConnectionString(db)}</code>
                    </pre>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(getConnectionString(db))
                      }
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
