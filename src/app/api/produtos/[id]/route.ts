import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Produto {
  id: number;
  nome: string;
  tipo: string;
  canabinoide: string;
  quantidade: number;
  preco: number;
  foto: string;
  descricao: string;
  dataCadastro: string;
  tags: string[];
}

function getArquivoPorTipo(tipo: string): string {
  switch (tipo) {
    case "Flor":
      return "flores.json";
    case "Óleo":
      return "oleos.json";
    case "Concentrado":
      return "concentrados.json";
    case "Comestíveis":
      return "comestiveis.json";
    default:
      throw new Error("Tipo de produto inválido");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const produto: Produto = await request.json();
    const arquivo = getArquivoPorTipo(produto.tipo);
    const caminhoArquivo = path.join(process.cwd(), "src/data", arquivo);

    // Lê o arquivo atual
    const dados = JSON.parse(fs.readFileSync(caminhoArquivo, "utf-8"));

    // Encontra o índice do produto
    const index = dados.produtos.findIndex((p: Produto) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza o produto
    dados.produtos[index] = produto;

    // Salva o arquivo atualizado
    fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { tipo } = body;

    if (!tipo) {
      return NextResponse.json(
        { success: false, error: "Tipo do produto não especificado" },
        { status: 400 }
      );
    }

    const arquivo = getArquivoPorTipo(tipo);
    const caminhoArquivo = path.join(process.cwd(), "src", "data", arquivo);

    // Lê o arquivo atual
    const dadosAtuais = JSON.parse(fs.readFileSync(caminhoArquivo, "utf-8"));

    // Encontra o índice do produto
    const indiceProduto = dadosAtuais.produtos.findIndex(
      (p: Produto) => p.id === id
    );

    if (indiceProduto === -1) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Remove o produto
    dadosAtuais.produtos.splice(indiceProduto, 1);

    // Salva o arquivo atualizado
    fs.writeFileSync(caminhoArquivo, JSON.stringify(dadosAtuais, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao excluir o produto" },
      { status: 500 }
    );
  }
}
