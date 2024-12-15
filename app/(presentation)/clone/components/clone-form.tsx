/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(presentation)/clone/components/clone-form.tsx
"use client";

import { PostgresContainer } from "@/app/domain/interfaces/container-postgres";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CloneProgress } from "./clone-progress";
import { useState } from "react";

const cloneFormSchema = z.object({
  source: z.object({
    url: z
      .string()
      .min(1, "La URL de conexión es requerida")
      .regex(/^postgres:\/\/.+/, "Debe ser una URL de PostgreSQL válida"),
  }),
  destination: z.object({
    containerName: z.string().min(1, "El contenedor destino es requerido"),
    database: z
      .string()
      .min(1, "El nombre de la base de datos destino es requerido"),
  }),
});

type CloneFormValues = z.infer<typeof cloneFormSchema>;

interface CloneFormProps {
  availableContainers: PostgresContainer[];
}

export function CloneForm({ availableContainers }: CloneFormProps) {
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloneStatus, setCloneStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const form = useForm<CloneFormValues>({
    resolver: zodResolver(cloneFormSchema),
    defaultValues: {
      source: {
        url: "",
      },
      destination: {
        containerName: "",
        database: "",
      },
    },
  });

  const onSubmit = async (values: CloneFormValues) => {
    setError(null);
    setCloneStatus(null);
    setIsCloning(true);

    try {
      const response = await fetch("/api/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar la clonación");
      }

      if (data.success) {
        setCloneStatus({
          success: true,
          message: data.message || "Clonación iniciada exitosamente",
        });
      } else {
        throw new Error(data.message || "Error durante la clonación");
      }
    } catch (error: any) {
      setError(error.message);
      setCloneStatus({
        success: false,
        message: error.message,
      });
    } finally {
      if (!error) {
        setTimeout(() => {
          setIsCloning(false);
        }, 1000);
      } else {
        setIsCloning(false);
      }
    }
  };

  const handleCancel = async () => {
    try {
      await fetch("/api/clone", { method: "DELETE" });
      setIsCloning(false);
    } catch (error) {
      console.error("Error al cancelar la clonación:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Origen</h2>
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
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Destino</h2>
            <FormField
              control={form.control}
              name="destination.containerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenedor destino</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isCloning}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un contenedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableContainers.map((container) => (
                        <SelectItem
                          key={container.containerName}
                          value={container.containerName}
                        >
                          {container.containerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination.database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base de datos destino</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nombre de la base de datos"
                      disabled={isCloning}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
              {error}
            </div>
          )}

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

          <div className="flex justify-between items-center">
            <Button type="submit" disabled={isCloning}>
              {isCloning ? "Clonando..." : "Iniciar Clonación"}
            </Button>
            {isCloning && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>

      {isCloning && <CloneProgress onComplete={() => setIsCloning(false)} />}
    </div>
  );
}
