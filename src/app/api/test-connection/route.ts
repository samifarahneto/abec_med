import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Testa a conexão listando as coleções do banco de dados
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      message: "Conexão com MongoDB estabelecida com sucesso",
      collections: collections.map((col) => col.name),
    });
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    return NextResponse.json(
      { message: "Erro ao conectar com MongoDB" },
      { status: 500 }
    );
  }
}
