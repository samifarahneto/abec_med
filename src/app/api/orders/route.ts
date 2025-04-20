import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const order = await request.json();

    // Lê o arquivo orders.json
    const filePath = path.join(process.cwd(), "src/data/orders.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Adiciona o novo pedido
    data.orders.push(order);

    // Salva o arquivo atualizado
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao salvar pedido" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/orders.json");
    console.log("Caminho do arquivo:", filePath);

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.log("Arquivo não existe, criando novo...");
      const initialData = { orders: [] };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
      return NextResponse.json(initialData);
    }

    // Lê o arquivo
    const fileContent = fs.readFileSync(filePath, "utf-8");
    console.log("Conteúdo do arquivo:", fileContent);

    // Verifica se o conteúdo está vazio
    if (!fileContent.trim()) {
      console.log("Arquivo vazio, inicializando...");
      const initialData = { orders: [] };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
      return NextResponse.json(initialData);
    }

    // Tenta parsear o JSON
    try {
      const data = JSON.parse(fileContent);
      console.log("JSON parseado com sucesso:", data);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      // Se houver erro no parse, cria um novo arquivo com estrutura inicial
      const initialData = { orders: [] };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
      return NextResponse.json(initialData);
    }
  } catch (error) {
    console.error("Erro ao ler pedidos:", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
