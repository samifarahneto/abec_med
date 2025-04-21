import { NextRequest, NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist";

type TextContentItem = pdfjsLib.TextContentItem;

// Configuração do worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractedData {
  medico: {
    nome: string;
    crm: string;
  };
  paciente: {
    nome: string;
    cpf: string;
  };
  medicamentos: Array<{
    nome: string;
    quantidade: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: TextContentItem) => {
          if ("str" in item) {
            return item.str;
          }
          return "";
        })
        .join(" ");
      fullText += pageText + "\n";
    }

    // Função auxiliar para extrair informações usando expressões regulares
    const extractInfo = (pattern: RegExp): string => {
      const match = fullText.match(pattern);
      return match ? match[1].trim() : "";
    };

    // Extrai informações do médico
    const nomeMedico = extractInfo(/Médico:\s*([^\n]+)/i);
    const crm = extractInfo(/CRM:\s*([^\n]+)/i);

    // Extrai informações do paciente
    const nomePaciente = extractInfo(/Paciente:\s*([^\n]+)/i);
    const cpf = extractInfo(/CPF:\s*([^\n]+)/i);

    // Extrai medicamentos
    const medicamentos: Array<{ nome: string; quantidade: string }> = [];
    const medicamentosMatch = fullText.match(
      /Medicamentos:([\s\S]*?)(?=\n\n|$)/i
    );

    if (medicamentosMatch) {
      const medicamentosText = medicamentosMatch[1];
      const medicamentosList = medicamentosText
        .split("\n")
        .filter((line: string) => line.trim());

      medicamentosList.forEach((line: string) => {
        const nome = line.trim();
        // Assumindo que a quantidade é o último número na linha
        const quantidadeMatch = line.match(/(\d+)\s*(?:comprimidos?|g|ml)?$/i);
        const quantidade = quantidadeMatch ? quantidadeMatch[1] : "1";

        medicamentos.push({ nome, quantidade });
      });
    }

    const extractedData: ExtractedData = {
      medico: {
        nome: nomeMedico || "Não encontrado",
        crm: crm || "Não encontrado",
      },
      paciente: {
        nome: nomePaciente || "Não encontrado",
        cpf: cpf || "Não encontrado",
      },
      medicamentos:
        medicamentos.length > 0
          ? medicamentos
          : [
              {
                nome: "Nenhum medicamento encontrado",
                quantidade: "0",
              },
            ],
    };

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("Erro ao extrair dados do PDF:", error);
    return NextResponse.json(
      { error: "Falha ao extrair dados do PDF" },
      { status: 500 }
    );
  }
}
