/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/clone/route.ts

import { databaseClonerUseCases } from "@/app/inyections";
import { NextResponse } from "next/server";

function parsePostgresUrl(url: string) {
  const regex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const matches = url.match(regex);

  if (!matches) {
    throw new Error("URL de conexión PostgreSQL inválida");
  }

  const [, user, password, host, port, database] = matches;

  return {
    host,
    port: parseInt(port),
    database,
    user,
    password,
  };
}

export async function POST(request: Request) {
  try {
    const { source, destination } = await request.json();

    // Parsear la URL de conexión
    const sourceConfig = parsePostgresUrl(source.url);

    // Iniciar la clonación con los datos parseados
    const result = await databaseClonerUseCases.cloneDatabase(sourceConfig, {
      containerName: destination.containerName,
      database: destination.database,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const progress = databaseClonerUseCases.getProgress();
    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al obtener el progreso",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await databaseClonerUseCases.cancelClone();
    return NextResponse.json({
      message: "Proceso de clonación cancelado exitosamente",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al cancelar el proceso de clonación",
      },
      { status: 500 }
    );
  }
}
