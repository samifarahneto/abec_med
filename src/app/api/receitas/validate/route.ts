import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Medicamento {
  nome: string;
  variacao: string;
  quantidadeMensal: number;
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
  arquivo: string;
}

const RECEITAS_FILE = path.join(process.cwd(), "src/data/receitas.json");

// Função auxiliar para ler o arquivo de receitas
function readReceitasFile(): Receita[] {
  try {
    if (!fs.existsSync(RECEITAS_FILE)) {
      return [];
    }

    const data = fs.readFileSync(RECEITAS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler arquivo de receitas:", error);
    throw new Error("Erro ao ler arquivo de receitas");
  }
}

// Função auxiliar para escrever no arquivo de receitas
function writeReceitasFile(receitas: Receita[]): void {
  try {
    fs.writeFileSync(RECEITAS_FILE, JSON.stringify(receitas, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao escrever arquivo de receitas:", error);
    throw new Error("Erro ao salvar receitas");
  }
}

export async function POST(request: Request) {
  try {
    const { id, medicamentos, medico } = await request.json();

    const receitas = readReceitasFile();
    const receitaIndex = receitas.findIndex((r) => r.id === id);

    if (receitaIndex === -1) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 }
      );
    }

    // Converter as quantidades mensais para números
    const medicamentosComQuantidadeNumerica = medicamentos.map(
      (med: Medicamento) => {
        // Remover "g/mês" se existir e converter para número
        const quantidade = med.quantidadeMensal
          .toString()
          .replace("g/mês", "")
          .trim();
        return {
          ...med,
          quantidadeMensal: Number(quantidade) || 0,
        };
      }
    );

    // Atualizar a receita com os novos medicamentos, dados do médico e status
    receitas[receitaIndex] = {
      ...receitas[receitaIndex],
      medicamentos: medicamentosComQuantidadeNumerica,
      medico: {
        ...receitas[receitaIndex].medico,
        nome: medico.nome,
        crm: medico.crm,
      },
      status: "aprovada",
    };

    writeReceitasFile(receitas);

    return NextResponse.json({
      success: true,
      receita: receitas[receitaIndex],
    });
  } catch (error) {
    console.error("Erro ao validar receita:", error);
    return NextResponse.json(
      { error: "Erro ao validar receita" },
      { status: 500 }
    );
  }
}
