import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    const mongoose = await connectDB();

    if (!mongoose.connection.db) {
      throw new Error("Conexão com o banco de dados não estabelecida");
    }

    // Testa a conexão listando os bancos de dados disponíveis
    const dbs = await mongoose.connection.db.admin().listDatabases();

    return NextResponse.json({
      success: true,
      message: "Conexão com MongoDB estabelecida com sucesso!",
      databases: dbs.databases.map((db: { name: string }) => db.name),
    });
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao conectar com MongoDB",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: error,
      },
      { status: 500 }
    );
  }
}
