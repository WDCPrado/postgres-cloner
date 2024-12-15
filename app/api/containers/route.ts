/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { postgresContainerUseCases } from "@/app/inyections/postgres-containers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const containers = await postgresContainerUseCases.listContainers();
    return NextResponse.json(containers);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al listar contenedores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const container = await request.json();
    await postgresContainerUseCases.createContainer(container);
    return NextResponse.json({ message: "Contenedor creado exitosamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el contenedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    if (!name) throw new Error("Nombre de contenedor requerido");

    await postgresContainerUseCases.deleteContainer(name);
    return NextResponse.json({ message: "Contenedor eliminado exitosamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el contenedor" },
      { status: 500 }
    );
  }
}
