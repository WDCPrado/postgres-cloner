// app/(presentation)/containers/components/container-card.tsx
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
import { ContainerDialog } from "./container-dialog";

interface ContainerCardProps {
  container: PostgresContainer;
  onDelete: (containerName: string) => Promise<void>;
}

export function ContainerCard({ container, onDelete }: ContainerCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <CardTitle>{container.containerName}</CardTitle>
          </div>
          <CardDescription>{container.image}</CardDescription>
          <div className="flex gap-2">
            <ContainerDialog container={container} />
            <Button
              variant="destructive"
              onClick={() => onDelete(container.containerName)}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Puerto Host:</span>
            <span className="font-medium">{container.ports.host}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Puerto Contenedor:</span>
            <span className="font-medium">{container.ports.container}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base de Datos:</span>
            <span className="font-medium">
              {container.environment.POSTGRES_DB}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
