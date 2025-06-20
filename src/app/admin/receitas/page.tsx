"use client";

import { useState, useEffect } from "react";
import {
  FaEye,
  FaTrash,
  FaSearch,
  FaCheck,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import MainLayout from "@/components/MainLayout";
import { Input, Table, Button } from "@/components/ui";

// Configuração do worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type TextContentItem = TextItem | TextMarkedContent;

interface Medicamento {
  nome: string;
  variacao: string;
  quantidadeMensal: string;
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
  [key: string]: unknown;
}

interface ExtractedData {
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

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceita, setSelectedReceita] = useState<Receita | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [editedMedicamentos, setEditedMedicamentos] = useState<Medicamento[]>(
    []
  );

  useEffect(() => {
    fetchReceitas();
  }, []);

  const fetchReceitas = async () => {
    try {
      const response = await fetch("/api/receitas");
      if (!response.ok) throw new Error("Erro ao carregar receitas");
      const data = await response.json();
      setReceitas(data);
    } catch {
      setError("Erro ao carregar receitas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

    try {
      const response = await fetch("/api/receitas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Erro ao excluir receita");

      setReceitas(receitas.filter((r) => r.id !== id));
    } catch {
      setError("Erro ao excluir receita");
    }
  };

  const handleMedicamentoChange = (
    index: number,
    field: keyof Medicamento,
    value: string
  ) => {
    if (editedMedicamentos.length === 0 && extractedData) {
      setEditedMedicamentos([...extractedData.medicamentos]);
    }

    const updatedMedicamentos = [...editedMedicamentos];
    updatedMedicamentos[index] = {
      ...updatedMedicamentos[index],
      [field]: value,
    };
    setEditedMedicamentos(updatedMedicamentos);
  };

  const handleValidate = async (id: string) => {
    try {
      const medicamentosToUse =
        editedMedicamentos.length > 0
          ? editedMedicamentos
          : extractedData?.medicamentos || [];

      const response = await fetch("/api/receitas/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          medicamentos: medicamentosToUse,
          medico: extractedData?.medico || {
            nome: "Médico não encontrado",
            crm: "CRM não encontrado",
          },
        }),
      });

      if (!response.ok) throw new Error("Erro ao validar receita");

      setReceitas(
        receitas.map((r) => (r.id === id ? { ...r, status: "aprovada" } : r))
      );
      setIsValidationModalOpen(false);
      setEditedMedicamentos([]);
    } catch {
      setError("Erro ao validar receita");
    }
  };

  const handleViewReceita = (receita: Receita) => {
    setSelectedReceita(receita);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReceita(null);
  };

  const handleValidateClick = async (receita: Receita) => {
    setSelectedReceita(receita);
    setIsValidationModalOpen(true);
    await extractDataFromPDF(`/uploads/receitas/${receita.arquivo}`);
  };

  const closeValidationModal = () => {
    setIsValidationModalOpen(false);
    setSelectedReceita(null);
  };

  const extractDataFromPDF = async (pdfUrl: string) => {
    try {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
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

      // Extraindo informações do médico e paciente
      const crmMatch = fullText.match(/CRM:\s+(\d+-\d+)/i);
      const nomeMedicoMatch = fullText.match(
        /Nome:\s+([A-Z\s]+)(?=\s+Endereço)/i
      );
      const telefoneMatch = fullText.match(/Telefone:\s+(\d+)/i);
      const pacienteMatch = fullText.match(
        /Paciente:\s+([A-Za-z\s]+)(?=\s+Endereço)/i
      );

      // Extraindo medicamentos
      const medicamentos: Medicamento[] = [];

      // Encontrar a seção de prescrição
      const prescricaoMatch = fullText.match(
        /Prescrição:([\s\S]*?)(?=Permite Medicamento Genérico:|$)/i
      );

      if (prescricaoMatch) {
        const prescricaoText = prescricaoMatch[1];

        // Padrão para encontrar medicamentos com THC
        const medicamentosRegex =
          /(?:uso contínuo\s+)?([A-Za-z\s]+(?:Concentrado|Inflorescências Terapêuticas)[\s\w]*)(?:rico|ricas) em THC[^\(]*\((\d+g\/mês)\)/gi;

        let match;
        while ((match = medicamentosRegex.exec(prescricaoText)) !== null) {
          const nome = match[1].trim();
          const quantidadeMensal = match[2].trim();

          medicamentos.push({
            nome,
            variacao: "THC",
            quantidadeMensal,
          });
        }
      }

      setExtractedData({
        medico: {
          nome: nomeMedicoMatch ? nomeMedicoMatch[1].trim() : "Não encontrado",
          crm: crmMatch ? crmMatch[1].trim() : "Não encontrado",
          telefone: telefoneMatch ? telefoneMatch[1].trim() : "Não encontrado",
        },
        paciente: {
          nome: pacienteMatch ? pacienteMatch[1].trim() : "Não encontrado",
        },
        medicamentos,
      });
    } catch (error) {
      console.error("Erro ao extrair dados do PDF:", error);
      setExtractedData(null);
    }
  };

  const filteredReceitas = receitas.filter(
    (receita) =>
      receita.paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receita.medico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Gerencie as receitas médicas do sistema
            </p>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar por paciente ou médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={() => {
                // TODO: Implementar navegação para página de cadastro de receita
                console.log("Navegar para cadastro de receita");
              }}
              icon={<FaPlus />}
              variant="primary"
              size="md"
              className="whitespace-nowrap"
            >
              Cadastrar Receita
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table<Receita>
          data={filteredReceitas}
          loading={loading}
          emptyMessage="Nenhuma receita encontrada"
          columns={[
            {
              key: "paciente",
              header: "Paciente",
              render: (receita: Receita) => (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {receita.paciente.nome}
                  </div>
                  <div className="text-xs text-gray-500">
                    {receita.paciente.cpf}
                  </div>
                </div>
              ),
              mobileLabel: "Paciente",
            },
            {
              key: "medico",
              header: "Médico",
              render: (receita: Receita) => (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {receita.medico.nome}
                  </div>
                  <div className="text-xs text-gray-500">
                    CRM: {receita.medico.crm}
                  </div>
                </div>
              ),
              mobileLabel: "Médico",
            },
            {
              key: "dataEmissao",
              header: "Data Emissão",
              render: (receita: Receita) => (
                <div className="text-center">
                  <div className="text-sm text-gray-700">
                    {new Date(receita.dataEmissao).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Válido até:{" "}
                    {new Date(receita.dataValidade).toLocaleDateString()}
                  </div>
                </div>
              ),
              mobileLabel: "Data Emissão",
            },
            {
              key: "status",
              header: "Status",
              render: (receita: Receita) => (
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg border ${
                    receita.status === "aprovada"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : receita.status === "rejeitada"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      receita.status === "aprovada"
                        ? "bg-green-500 animate-pulse"
                        : receita.status === "rejeitada"
                        ? "bg-red-500"
                        : "bg-yellow-500 animate-pulse"
                    }`}
                  ></div>
                  {receita.status.charAt(0).toUpperCase() +
                    receita.status.slice(1)}
                </span>
              ),
              mobileLabel: "Status",
            },
          ]}
          actions={[
            {
              label: "Visualizar",
              icon: <FaEye className="w-4 h-4" />,
              onClick: handleViewReceita,
              variant: "secondary" as const,
            },
            {
              label: "Validar",
              icon: <FaCheck className="w-4 h-4" />,
              onClick: handleValidateClick,
              variant: "primary" as const,
            },
            {
              label: "Excluir",
              icon: <FaTrash className="w-4 h-4" />,
              onClick: (receita: Receita) => handleDelete(receita.id),
              variant: "danger" as const,
            },
          ]}
          mobileCardRender={(receita: Receita) => (
            <>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {receita.paciente.nome}
                  </h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {receita.paciente.cpf}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg border ml-3 ${
                    receita.status === "aprovada"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : receita.status === "rejeitada"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      receita.status === "aprovada"
                        ? "bg-green-500 animate-pulse"
                        : receita.status === "rejeitada"
                        ? "bg-red-500"
                        : "bg-yellow-500 animate-pulse"
                    }`}
                  ></div>
                  {receita.status.charAt(0).toUpperCase() +
                    receita.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Médico</p>
                  <p className="text-sm text-gray-900">{receita.medico.nome}</p>
                  <p className="text-xs text-gray-500">
                    CRM: {receita.medico.crm}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Data de Emissão
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(receita.dataEmissao).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Válido até:{" "}
                    {new Date(receita.dataValidade).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          )}
        />

        {/* Modal */}
        {isModalOpen && selectedReceita && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-4xl w-full h-[90vh] sm:h-[85vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Visualização da Receita
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`/uploads/receitas/${selectedReceita.arquivo}`}
                  className="w-full h-full border-0 rounded"
                  title="Visualização da Receita"
                />
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Paciente
                    </h3>
                    <p className="text-gray-900">
                      {selectedReceita.paciente.nome}
                    </p>
                    <p className="text-sm text-gray-500">
                      CPF: {selectedReceita.paciente.cpf}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Médico
                    </h3>
                    <p className="text-gray-900">
                      {selectedReceita.medico.nome}
                    </p>
                    <p className="text-sm text-gray-500">
                      CRM: {selectedReceita.medico.crm}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedReceita.status === "aprovada"
                        ? "bg-green-100 text-green-800"
                        : selectedReceita.status === "rejeitada"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedReceita.status.charAt(0).toUpperCase() +
                      selectedReceita.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Validação */}
        {isValidationModalOpen && selectedReceita && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-6xl my-4 sm:my-8 flex flex-col max-h-[95vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Validar Receita
                </h2>
                <button
                  onClick={closeValidationModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-6">
                {/* Coluna da Esquerda - Preview do PDF */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <iframe
                    src={`/uploads/receitas/${selectedReceita.arquivo}#view=FitH&toolbar=0&navpanes=0`}
                    className="w-full h-full border-0"
                    title="Visualização da Receita"
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>

                {/* Coluna da Direita - Informações Extraídas */}
                <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2">
                  {extractedData ? (
                    <>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Informações do Paciente
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500 w-1/4">
                                  Nome
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {extractedData.paciente.nome}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Informações do Médico
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500 w-1/4">
                                  Nome
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {extractedData.medico.nome}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                                  CRM
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {extractedData.medico.crm}
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                                  Telefone
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {extractedData.medico.telefone}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Medicamentos
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Nome
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Variação
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantidade Liberada
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {extractedData.medicamentos.length > 0 ? (
                                (editedMedicamentos.length > 0
                                  ? editedMedicamentos
                                  : extractedData.medicamentos
                                ).map((med, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {med.nome}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {med.variacao}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="number"
                                          value={
                                            editedMedicamentos.length > 0
                                              ? editedMedicamentos[
                                                  index
                                                ].quantidadeMensal.replace(
                                                  "g/mês",
                                                  ""
                                                )
                                              : med.quantidadeMensal.replace(
                                                  "g/mês",
                                                  ""
                                                )
                                          }
                                          onChange={(e) =>
                                            handleMedicamentoChange(
                                              index,
                                              "quantidadeMensal",
                                              e.target.value
                                            )
                                          }
                                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-[#16829E] text-gray-900"
                                          min="0"
                                        />
                                        <span className="text-sm text-gray-900">
                                          g/mês
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="px-4 py-2 text-sm text-gray-500 text-center"
                                  >
                                    Nenhum medicamento encontrado
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Aprovação
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 mb-0.5">
                              Status Atual
                            </p>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                selectedReceita.status === "aprovada"
                                  ? "bg-green-100 text-green-800"
                                  : selectedReceita.status === "rejeitada"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {selectedReceita.status.charAt(0).toUpperCase() +
                                selectedReceita.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleValidate(selectedReceita.id)}
                              className="flex-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={closeValidationModal}
                              className="flex-1 bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Extraindo dados do PDF...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
