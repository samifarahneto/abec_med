import { NextResponse } from "next/server";
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
}

const getArquivoPorTipo = (tipo: string) => {
  const tipoNormalizado = decodeURIComponent(tipo).trim();

  switch (tipoNormalizado) {
    case "Flor":
      return "flores.json";
    case "Óleo":
      return "oleos.json";
    case "Concentrado":
      return "concentrados.json";
    case "Comestíveis":
      return "comestiveis.json";
    default:
      console.error(`Tipo de produto inválido: ${tipoNormalizado}`);
      return "flores.json";
  }
};

export async function POST(request: Request) {
  try {
    const produto = await request.json();
    console.log("Produto recebido:", produto); // Debug

    const arquivo = getArquivoPorTipo(produto.tipo);
    const caminhoArquivo = path.join(process.cwd(), "src", "data", arquivo);

    // Lê o arquivo atual
    const dadosAtuais = JSON.parse(fs.readFileSync(caminhoArquivo, "utf-8"));

    // Gera um novo ID
    const novoId =
      dadosAtuais.produtos.length > 0
        ? Math.max(...dadosAtuais.produtos.map((p: Produto) => p.id)) + 1
        : 1;

    // Cria o novo produto
    const novoProduto = {
      ...produto,
      id: novoId,
      dataCadastro: new Date().toISOString(),
      foto: produto.foto || "/produtos/sem-foto.jpg",
    };

    console.log("Novo produto a ser salvo:", novoProduto); // Debug

    // Adiciona o novo produto
    dadosAtuais.produtos.push(novoProduto);

    // Salva o arquivo atualizado
    fs.writeFileSync(caminhoArquivo, JSON.stringify(dadosAtuais, null, 2));

    return NextResponse.json({ success: true, produto: novoProduto });
  } catch (error) {
    console.error("Erro ao salvar o produto:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar o produto" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");

    if (!tipo) {
      return NextResponse.json(
        { success: false, error: "Tipo de produto não especificado" },
        { status: 400 }
      );
    }

    const arquivo = getArquivoPorTipo(tipo);
    const caminhoArquivo = path.join(process.cwd(), "src", "data", arquivo);

    if (!fs.existsSync(caminhoArquivo)) {
      console.error(`Arquivo não encontrado: ${caminhoArquivo}`);
      return NextResponse.json(
        { success: false, error: "Arquivo de produtos não encontrado" },
        { status: 404 }
      );
    }

    const dados = JSON.parse(fs.readFileSync(caminhoArquivo, "utf-8"));

    if (!dados.produtos || !Array.isArray(dados.produtos)) {
      console.error(`Estrutura de dados inválida em ${arquivo}`);
      return NextResponse.json(
        { success: false, error: "Estrutura de dados inválida" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, produtos: dados.produtos });
  } catch (error) {
    console.error("Erro ao ler produtos:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao ler produtos" },
      { status: 500 }
    );
  }
}
