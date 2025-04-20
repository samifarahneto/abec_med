import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Order {
  id: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  total: number;
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  status: "success" | "failed";
  address: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  payment: {
    tipo: string;
    numeroCartao: string;
    nomeTitular: string;
    validade: string;
    cvv: string;
  };
  trackingCode?: string;
}

interface OrdersData {
  orders: Order[];
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Iniciando processamento da requisição de rastreio");
    const { trackingCode } = await request.json();
    const orderId = params.id;
    console.log("ID do pedido:", orderId);
    console.log("Código de rastreio recebido:", trackingCode);

    if (!trackingCode) {
      console.log("Código de rastreio não fornecido");
      return NextResponse.json(
        { error: "Código de rastreio é obrigatório" },
        { status: 400 }
      );
    }

    // Caminho para o arquivo orders.json
    const filePath = path.join(process.cwd(), "src/data/orders.json");
    console.log("Caminho do arquivo orders.json:", filePath);

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.log("Arquivo orders.json não encontrado");
      return NextResponse.json(
        { error: "Arquivo de pedidos não encontrado" },
        { status: 404 }
      );
    }

    // Lê o arquivo orders.json
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(filePath, "utf-8");
      console.log("Conteúdo do arquivo lido com sucesso");
    } catch (readError) {
      console.error("Erro ao ler arquivo:", readError);
      return NextResponse.json(
        { error: "Erro ao ler arquivo de pedidos" },
        { status: 500 }
      );
    }

    let ordersData: OrdersData;
    try {
      ordersData = JSON.parse(fileContent);
      console.log(
        "JSON parseado com sucesso, número de pedidos:",
        ordersData.orders.length
      );
    } catch (parseError) {
      console.error("Erro ao fazer parse do arquivo:", parseError);
      return NextResponse.json(
        { error: "Erro ao ler arquivo de pedidos" },
        { status: 500 }
      );
    }

    // Encontra o pedido pelo ID
    const orderIndex = ordersData.orders.findIndex(
      (order) => order.id === orderId
    );
    console.log("Índice do pedido encontrado:", orderIndex);

    if (orderIndex === -1) {
      console.log("Pedido não encontrado com ID:", orderId);
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza o código de rastreio do pedido
    ordersData.orders[orderIndex].trackingCode = trackingCode;
    console.log("Pedido atualizado com novo código de rastreio");

    try {
      // Salva as alterações no arquivo
      fs.writeFileSync(filePath, JSON.stringify(ordersData, null, 2));
      console.log("Arquivo salvo com sucesso");
    } catch (writeError) {
      console.error("Erro ao salvar arquivo:", writeError);
      return NextResponse.json(
        { error: "Erro ao salvar alterações" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: ordersData.orders[orderIndex],
    });
  } catch (error) {
    console.error("Erro não tratado:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a requisição" },
      { status: 500 }
    );
  }
}
