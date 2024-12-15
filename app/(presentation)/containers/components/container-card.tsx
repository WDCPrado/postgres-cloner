"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { PostgresContainer } from "@/app/domain/interfaces/container-postgres";

interface ContainerCardProps {
  container: PostgresContainer;
  onDelete: (containerName: string) => Promise<void>;
}

export function ContainerCard({ container, onDelete }: ContainerCardProps) {
  const isActive = true; // Simulación de estado (sustituir por lógica real)
  console.log(container);
  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div
              className={`h-3 w-3 rounded-full ${
                isActive ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
              title={isActive ? "Activo" : "Inactivo"}
            />
            <CardTitle className="text-lg font-semibold">
              {container.containerName}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <CardDescription className="text-sm font-medium">
              {container.image}
            </CardDescription>
            <Button
              variant="destructive"
              size="icon"
              className="hover:scale-105 transition-transform"
              onClick={() => onDelete(container.containerName)}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Puerto Host:</span>
            <span className="font-medium bg-background px-3 py-1 rounded-md">
              {container.ports.host}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Puerto Contenedor:
            </span>
            <span className="font-medium bg-background px-3 py-1 rounded-md">
              {container.ports.container}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
