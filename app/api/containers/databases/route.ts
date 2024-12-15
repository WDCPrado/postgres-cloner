import { postgresContainerUseCases } from "@/app/inyections";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const containerName = searchParams.get("container");

    if (!containerName) {
      return NextResponse.json(
        { error: "Nombre del contenedor requerido" },
        { status: 400 }
      );
    }

    const databases = await postgresContainerUseCases.listDatabases(
      containerName
    );
    return NextResponse.json({ databases });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
