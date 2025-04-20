import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
  observacoes: string;
  arquivo?: string;
}

const RECEITAS_FILE = path.join(process.cwd(), "src/data/receitas.json");

// Garantir que o diretório existe
const dataDir = path.join(process.cwd(), "src/data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Função auxiliar para ler o arquivo de receitas
function readReceitasFile(): Receita[] {
  try {
    console.log("Tentando ler arquivo de receitas:", RECEITAS_FILE);

    if (!fs.existsSync(RECEITAS_FILE)) {
      console.log("Arquivo não existe, criando novo...");
      const initialData: Receita[] = [
        {
          id: "1",
          paciente: {
            id: "1",
            nome: "João Silva",
            cpf: "123.456.789-00",
          },
          medico: {
            id: "1",
            nome: "Dra. Maria Santos",
            crm: "12345-SP",
          },
          medicamentos: [
            {
              nome: "Paracetamol",
              dosagem: "500mg",
              posologia: "1 comprimido a cada 6 horas",
              quantidade: 20,
            },
          ],
          dataEmissao: new Date().toISOString(),
          dataValidade: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: "pendente" as const,
          observacoes: "Tomar com alimentos",
        },
      ];
      fs.writeFileSync(
        RECEITAS_FILE,
        JSON.stringify(initialData, null, 2),
        "utf-8"
      );
      return initialData;
    }

    const data = fs.readFileSync(RECEITAS_FILE, "utf-8");
    const receitas = JSON.parse(data);
    console.log("Receitas lidas:", receitas);
    return receitas;
  } catch (error) {
    console.error("Erro ao ler arquivo de receitas:", error);
    throw new Error("Erro ao ler arquivo de receitas");
  }
}

// Função auxiliar para escrever no arquivo de receitas
function writeReceitasFile(receitas: Receita[]): void {
  try {
    console.log("Escrevendo receitas no arquivo:", receitas);
    fs.writeFileSync(RECEITAS_FILE, JSON.stringify(receitas, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao escrever arquivo de receitas:", error);
    throw new Error("Erro ao salvar receitas");
  }
}

// GET /api/receitas - Lista todas as receitas
export async function GET() {
  try {
    console.log("Iniciando GET /api/receitas");
    const receitas = readReceitasFile();
    console.log("Retornando receitas:", receitas);
    return NextResponse.json(receitas);
  } catch (error) {
    console.error("Erro no GET /api/receitas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar receitas" },
      { status: 500 }
    );
  }
}

// POST /api/receitas - Cria uma nova receita
export async function POST(request: Request) {
  try {
    const receitas = readReceitasFile();
    const novaReceita = (await request.json()) as Omit<
      Receita,
      "id" | "status"
    >;

    const receitaCompleta: Receita = {
      ...novaReceita,
      id: Date.now().toString(),
      status: "pendente",
    };

    receitas.push(receitaCompleta);
    writeReceitasFile(receitas);

    return NextResponse.json(receitaCompleta);
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar receita" },
      { status: 500 }
    );
  }
}

// PUT /api/receitas - Atualiza uma receita existente
export async function PUT(request: Request) {
  try {
    const receitas = readReceitasFile();
    const receitaAtualizada = (await request.json()) as Receita;

    const index = receitas.findIndex((r) => r.id === receitaAtualizada.id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 }
      );
    }

    receitas[index] = { ...receitas[index], ...receitaAtualizada };
    writeReceitasFile(receitas);

    return NextResponse.json(receitas[index]);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar receita" },
      { status: 500 }
    );
  }
}

// DELETE /api/receitas - Remove uma receita
export async function DELETE(request: Request) {
  try {
    const receitas = readReceitasFile();
    const { id } = (await request.json()) as { id: string };

    const index = receitas.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 }
      );
    }

    receitas.splice(index, 1);
    writeReceitasFile(receitas);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir receita" },
      { status: 500 }
    );
  }
}
