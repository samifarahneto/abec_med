"use client";

import { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import MainLayout from "@/components/MainLayout";

type TextContentItem = TextItem | TextMarkedContent;

interface Medicamento {
  nome: string;
  variacao: string;
  quantidadeMensal: string;
}

interface ReceitaInfo {
  medico: {
    nome: string;
    crm: string;
    telefone: string;
  };
  paciente: {
    nome: string;
  };
  medicamentos: Medicamento[];
}

export default function ReceitasPaciente() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [receitaInfo, setReceitaInfo] = useState<ReceitaInfo | null>(null);
  const [textoExtraido, setTextoExtraido] = useState<string>("");

  useEffect(() => {
    // Configuração do worker do PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const extractReceitaInfo = (text: string): ReceitaInfo => {
    // Extraindo informações do médico e paciente
    const crmMatch = text.match(/CRM:\s+(\d+-\d+)/i);
    const nomeMedicoMatch = text.match(/Nome:\s+([A-Z\s]+)(?=\s+Endereço)/i);
    const telefoneMatch = text.match(/Telefone:\s+(\d+)/i);
    const pacienteMatch = text.match(
      /Paciente:\s+([A-Za-z\s]+)(?=\s+Endereço)/i
    );

    // Extraindo medicamentos
    const medicamentos: Medicamento[] = [];

    // Padrão para encontrar os medicamentos e suas informações
    const medicamentosText = text.match(
      /Prescrição:([\s\S]*?)(?=Permite Medicamento Genérico:|$)/
    );

    if (medicamentosText) {
      // Encontrar todas as ocorrências de medicamentos com THC
      const medicamentosRegex =
        /(?:uso contínuo\s+)?([A-Za-z\s]+(?:Concentrado|Inflorescências Terapêuticas)[\s\w]*)(?:rico|ricas) em THC[^\(]*\((\d+g\/mês)\)/g;
      let match;

      while ((match = medicamentosRegex.exec(medicamentosText[1])) !== null) {
        const nome = match[1].trim();
        const quantidadeMensal = match[2];

        medicamentos.push({
          nome,
          variacao: "THC",
          quantidadeMensal,
        });
      }
    }

    return {
      medico: {
        nome: nomeMedicoMatch ? nomeMedicoMatch[1].trim() : "Não encontrado",
        crm: crmMatch ? crmMatch[1].trim() : "Não encontrado",
        telefone: telefoneMatch ? telefoneMatch[1].trim() : "Não encontrado",
      },
      paciente: {
        nome: pacienteMatch ? pacienteMatch[1].trim() : "Não encontrado",
      },
      medicamentos,
    };
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      if (file.type === "application/pdf") {
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

        setTextoExtraido(fullText);
        setReceitaInfo(extractReceitaInfo(fullText));
      } else if (file.type.startsWith("image/")) {
        const worker = await createWorker("por");
        const {
          data: { text },
        } = await worker.recognize(file);
        setTextoExtraido(text);
        setReceitaInfo(extractReceitaInfo(text));
        await worker.terminate();
      }
    } catch (error) {
      console.error("Erro ao extrair texto:", error);
      setReceitaInfo(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">
          Minhas Receitas
        </h1>

        {/* Área de Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload de Receita
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#16829E] file:text-white
                  hover:file:bg-[#1E3A8A]"
              />
              {isProcessing && (
                <span className="text-sm text-gray-500">Processando...</span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Formatos aceitos: PDF, JPG, JPEG, PNG
            </p>
          </div>

          {/* Informações extraídas */}
          {receitaInfo && (
            <div className="mt-4">
              <div className="bg-white p-4 rounded-md">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-black">
                      Texto Extraído:
                    </h4>
                    <div className="ml-4 p-4 bg-gray-50 rounded-md">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {textoExtraido}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Médico:</h4>
                    <div className="ml-4 space-y-1">
                      <p className="text-black">
                        <span className="font-medium">Nome:</span>{" "}
                        {receitaInfo.medico.nome}
                      </p>
                      <p className="text-black">
                        <span className="font-medium">CRM:</span>{" "}
                        {receitaInfo.medico.crm}
                      </p>
                      <p className="text-black">
                        <span className="font-medium">Telefone:</span>{" "}
                        {receitaInfo.medico.telefone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Paciente:</h4>
                    <div className="ml-4">
                      <p className="text-black">
                        <span className="font-medium">Nome:</span>{" "}
                        {receitaInfo.paciente.nome}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Medicamentos:</h4>
                    <div className="ml-4 space-y-4">
                      {receitaInfo.medicamentos.map((medicamento, index) => (
                        <div key={index} className="border-b pb-2">
                          <p className="text-black">
                            <span className="font-medium">Nome:</span>{" "}
                            {medicamento.nome}
                          </p>
                          <p className="text-black">
                            <span className="font-medium">Variação:</span>{" "}
                            {medicamento.variacao}
                          </p>
                          <p className="text-black">
                            <span className="font-medium">
                              Quantidade Mensal:
                            </span>{" "}
                            {medicamento.quantidadeMensal}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aqui serão exibidas as receitas quando houver */}
        </div>
      </div>
    </MainLayout>
  );
}
