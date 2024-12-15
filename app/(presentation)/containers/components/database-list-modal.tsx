/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostgresContainer } from "@/app/domain/interfaces/container-postgres";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CloneProgress } from "./clone-progress";

const cloneFormSchema = z.object({
  source: z.object({
    url: z
      .string()
      .min(1, "La URL de conexión es requerida")
      .regex(/^postgres:\/\/.+/, "Debe ser una URL de PostgreSQL válida"),
  }),
  destination: z.object({
    database: z
      .string()
      .min(1, "El nombre de la base de datos destino es requerido"),
  }),
});

type CloneFormValues = z.infer<typeof cloneFormSchema>;

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
  const { toast } = useToast();
  const [databases, setDatabases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneStatus, setCloneStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const form = useForm<CloneFormValues>({
    resolver: zodResolver(cloneFormSchema),
    defaultValues: {
      source: { url: "" },
      destination: { database: "" },
    },
  });

  const getConnectionString = (dbName: string) => {
    const { POSTGRES_USER, POSTGRES_PASSWORD } = container.environment;
    const { host: port } = container.ports;
    return `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${port}/${dbName}`;
  };

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

  const onSubmit = async (values: CloneFormValues) => {
    setError(null);
    setCloneStatus(null);
    setIsCloning(true);

    try {
      const response = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: values.source,
          destination: {
            containerName: container.containerName,
            database: values.destination.database,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el proceso de clonación");
      }

      setCloneStatus({
        success: true,
        message: "Base de datos clonada exitosamente",
      });

      // Recargar la lista de bases de datos
      const dbResponse = await fetch(
        `/api/containers/databases?container=${container.containerName}`
      );
      const dbData = await dbResponse.json();
      if (dbResponse.ok) {
        setDatabases(dbData.databases);
      }
    } catch (error: any) {
      setError(error.message);
      setCloneStatus({
        success: false,
        message: error.message,
      });
    } finally {
      setIsCloning(false);
    }
  };
  const onCloseModal = () => {
    onClose();
    form.reset();
  };

  const handleCopyConnection = (db: string) => {
    navigator.clipboard.writeText(getConnectionString(db));
    toast({
      title: "Texto copiado",
      description: "URL de conexión copiada al portapapeles",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseModal}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Bases de Datos en {container.containerName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Formulario de Clonación - Lado Izquierdo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Clonar Base de Datos</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="source.url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Conexión PostgreSQL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="postgres://usuario:contraseña@host:puerto/base_datos"
                          disabled={isCloning}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination.database"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Base de Datos Destino</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nombre de la nueva base de datos"
                          disabled={isCloning}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {cloneStatus && (
                  <div
                    className={`p-3 rounded-md ${
                      cloneStatus.success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cloneStatus.message}
                  </div>
                )}

                <Button type="submit" disabled={isCloning}>
                  {isCloning ? "Clonando..." : "Iniciar Clonación"}
                </Button>
              </form>
            </Form>

            {isCloning && (
              <CloneProgress onComplete={() => setIsCloning(false)} />
            )}
          </div>

          {/* Lista de Bases de Datos - Lado Derecho */}
          <div className="border-l pl-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Bases de Datos Disponibles
              </h3>
              <ScrollArea className="h-[400px] pr-4">
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
                              onClick={() => handleCopyConnection(db)}
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
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
