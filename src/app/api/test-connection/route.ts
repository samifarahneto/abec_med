import { NextResponse } from "next/server";
import { testConnection } from "@/lib/json-db";

export async function GET() {
  try {
    const isConnected = await testConnection();

    if (!isConnected) {
      return NextResponse.json(
        { error: "Falha na conexão com o banco de dados" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com o banco de dados JSON estabelecida com sucesso",
    });
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return NextResponse.json(
      { error: "Erro ao testar conexão com o banco de dados" },
      { status: 500 }
    );
  }
}
