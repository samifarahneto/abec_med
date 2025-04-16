import { connectToDatabase } from "@/lib/mongodb";

export async function testConnection() {
  try {
    const { db } = await connectToDatabase();

    // Testa a conexão listando as coleções do banco de dados
    const collections = await db.listCollections().toArray();

    return {
      success: true,
      message: "Conexão com MongoDB estabelecida com sucesso",
      collections: collections.map((col) => col.name),
    };
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    return {
      success: false,
      message: "Erro ao conectar com MongoDB",
    };
  }
}

// Executa o teste
testConnection();
