"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostgresContainer } from "@/app/domain/interfaces/container-postgres";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";

const containerFormSchema = z.object({
  containerName: z.string().min(1, "El nombre es requerido"),
  image: z.string().min(1, "La imagen es requerida"),
  ports: z.object({
    host: z.coerce.number().min(1, "Puerto host requerido"),
    container: z.coerce.number().min(1, "Puerto contenedor requerido"),
  }),
  environment: z.object({
    POSTGRES_USER: z.string().min(1, "Usuario requerido"),
    POSTGRES_PASSWORD: z.string().min(1, "Contraseña requerida"),
    POSTGRES_DB: z.string().min(1, "Base de datos requerida"),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_HOST: z.string().default("localhost"),
  }),
});

type ContainerFormValues = z.infer<typeof containerFormSchema>;

interface ContainerDialogProps {
  container?: PostgresContainer;
}

export function ContainerDialog({ container }: ContainerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContainerFormValues>({
    resolver: zodResolver(containerFormSchema),
    defaultValues: container || {
      containerName: "",
      image: "postgres:latest",
      ports: {
        host: 5432,
        container: 5432,
      },
      environment: {
        POSTGRES_USER: "",
        POSTGRES_PASSWORD: "",
        POSTGRES_DB: "",
        POSTGRES_PORT: 5432,
        POSTGRES_HOST: "localhost",
      },
    },
  });

  const onSubmit = async (values: ContainerFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/containers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error al crear el contenedor");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!container?.containerName) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/containers?name=${container.containerName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el contenedor");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={container ? "outline" : "default"}>
          {container ? "Editar" : "Nuevo Contenedor"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {container ? "Editar Contenedor" : "Nuevo Contenedor"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="containerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Contenedor</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label="Nombre del Contenedor"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label="Imagen"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ports.host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puerto Host</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        aria-label="Puerto Host"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ports.container"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puerto Contenedor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        aria-label="Puerto Contenedor"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="environment.POSTGRES_USER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario PostgreSQL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label="Usuario PostgreSQL"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="environment.POSTGRES_PASSWORD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña PostgreSQL</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      aria-label="Contraseña PostgreSQL"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="environment.POSTGRES_DB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base de Datos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label="Base de Datos"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Procesando..."
                  : container
                  ? "Actualizar"
                  : "Crear"}
              </Button>
              {container && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Eliminar"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
