import clientPromise from "@/lib/mongodb";

interface DatabaseInfo {
  name: string;
  sizeOnDisk?: number;
  empty?: boolean;
}

async function testConnection() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Testa a conexão listando os bancos de dados
    const dbs = await db.admin().listDatabases();
    console.log("Conexão com MongoDB estabelecida com sucesso!");
    console.log(
      "Bancos de dados disponíveis:",
      dbs.databases.map((db: DatabaseInfo) => db.name)
    );

    return true;
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    return false;
  }
}

// Executa o teste
testConnection();
