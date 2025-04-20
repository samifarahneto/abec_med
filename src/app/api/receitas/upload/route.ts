import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "next-auth/jwt";
import { findUserByEmail } from "@/lib/json-db";
import { NextRequest } from "next/server";

interface Medicamento {
  nome: string;
  dosagem: string;
  posologia: string;
  quantidade: number;
}

interface Receita {
  id: string;
  paciente: {
    id: string;
    nome: string;
    cpf: string;
  };
  medico: {
    id: string;
    nome: string;
    crm: string;
  };
  medicamentos: Medicamento[];
  dataEmissao: string;
  dataValidade: string;
  status: "pendente" | "aprovada" | "rejeitada";
  arquivo?: string;
  observacoes: string;
}

const uploadsDir = path.join(process.cwd(), "public/uploads/receitas");
const receitasFilePath = path.join(process.cwd(), "src/data/receitas.json");

// Garantir que o diretório de uploads existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    // Obter o token da sessão
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Obter os dados do usuário do banco de dados
    const user = await findUserByEmail(token.email as string);
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const observacoes = formData.get("observacoes") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Salvar o arquivo
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Ler o arquivo de receitas existente
    let receitas: Receita[] = [];
    if (fs.existsSync(receitasFilePath)) {
      const fileContent = fs.readFileSync(receitasFilePath, "utf-8");
      const data = JSON.parse(fileContent);
      receitas = Array.isArray(data) ? data : data.receitas || [];
    }

    // Adicionar nova receita
    const novaReceita: Receita = {
      id: uuidv4(),
      paciente: {
        id: user.id,
        nome: user.name,
        cpf: "123.456.789-00", // TODO: Adicionar CPF ao modelo de usuário
      },
      medico: {
        id: "1", // TODO: Pegar do médico da receita
        nome: "Médico Teste", // TODO: Pegar do médico da receita
        crm: "12345-SP", // TODO: Pegar do médico da receita
      },
      medicamentos: [], // TODO: Extrair da receita
      dataEmissao: new Date().toISOString(),
      dataValidade: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 dias
      status: "pendente",
      arquivo: fileName,
      observacoes: observacoes || "",
    };

    receitas.push(novaReceita);

    // Salvar as alterações
    fs.writeFileSync(receitasFilePath, JSON.stringify(receitas, null, 2));

    return NextResponse.json({
      success: true,
      receita: novaReceita,
    });
  } catch (error) {
    console.error("Erro ao processar upload:", error);
    return NextResponse.json(
      { error: "Erro ao processar upload da receita" },
      { status: 500 }
    );
  }
}
