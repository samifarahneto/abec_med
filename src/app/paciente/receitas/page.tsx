"use client";

import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/MainLayout";
import { FaUpload, FaFilePdf, FaClipboardList, FaTimes } from "react-icons/fa";
import ModalReceitas from "@/components/ModalReceitas";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  arquivo?: string;
  observacoes?: string;
}

export default function ReceitasPaciente() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isControleModalOpen, setIsControleModalOpen] = useState(false);
  const [medicamentosAgrupados, setMedicamentosAgrupados] = useState<
    Record<string, number>
  >({});

  const calcularMedicamentosAgrupados = useCallback(() => {
    const agrupados: Record<string, number> = {};

    receitas.forEach((receita) => {
      if (receita.status === "aprovada") {
        receita.medicamentos.forEach((med) => {
          const chave = `${med.nome} (${med.variacao})`;
          agrupados[chave] = (agrupados[chave] || 0) + med.quantidadeMensal;
        });
      }
    });

    setMedicamentosAgrupados(agrupados);
  }, [receitas]);

  useEffect(() => {
    if (receitas.length > 0) {
      calcularMedicamentosAgrupados();
    }
  }, [receitas, calcularMedicamentosAgrupados]);

  const recarregarReceitas = async () => {
    try {
      if (!session?.user?.id) return;

      setLoading(true);
      const response = await fetch("/api/receitas");
      if (!response.ok) {
        throw new Error("Erro ao carregar receitas");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Formato de dados inválido");
      }

      const receitasUsuario = data.filter(
        (receita: Receita) => receita.paciente.id === session.user.id
      );

      setReceitas(receitasUsuario);
      setError(null);
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
      setError("Erro ao carregar receitas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Status da sessão:", status);
    console.log("Dados da sessão:", session);
    console.log("ID do usuário:", session?.user?.id);
    console.log("Tipo do ID do usuário:", typeof session?.user?.id);

    const fetchReceitas = async () => {
      try {
        if (!session?.user?.id) {
          console.log("ID do usuário não disponível");
          setLoading(false);
          return;
        }

        console.log("Iniciando busca de receitas...");
        const response = await fetch("/api/receitas");
        console.log("Resposta recebida:", response);

        if (!response.ok) {
          throw new Error("Erro ao carregar receitas");
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        if (!Array.isArray(data)) {
          throw new Error("Formato de dados inválido");
        }

        console.log("Receitas antes do filtro:", data);
        const receitasUsuario = data.filter((receita: Receita) => {
          console.log("Comparando IDs:", {
            receitaPacienteId: receita.paciente.id,
            usuarioId: session.user.id,
            tipos: {
              receitaPacienteId: typeof receita.paciente.id,
              usuarioId: typeof session.user.id,
            },
          });
          return receita.paciente.id === session.user.id;
        });
        console.log("Receitas filtradas:", receitasUsuario);

        setReceitas(receitasUsuario);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar receitas:", error);
        setError("Erro ao carregar receitas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      fetchReceitas();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando sessão...</p>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando receitas...</p>
        </div>
      </MainLayout>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-1 py-4 border-b-2 border-[#16829E] text-[#16829E] font-medium"
            >
              <FaUpload className="mr-2" />
              Enviar receita
            </button>
            <button
              onClick={() => setIsControleModalOpen(true)}
              className="inline-flex items-center px-1 py-4 border-b-2 border-transparent text-gray-500 hover:text-[#16829E] hover:border-[#16829E] font-medium"
            >
              <FaClipboardList className="mr-2" />
              Controle de receitas
            </button>
          </nav>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#16829E]">Minhas Receitas</h1>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : receitas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma receita encontrada</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Emissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Validade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receitas.map((receita) => (
                  <tr key={receita.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {receita.medico.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        CRM: {receita.medico.crm}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(receita.dataEmissao).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(receita.dataValidade).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          receita.status === "aprovada"
                            ? "bg-green-100 text-green-800"
                            : receita.status === "rejeitada"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {receita.status.charAt(0).toUpperCase() +
                          receita.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receita.arquivo && (
                        <a
                          href={`/uploads/receitas/${receita.arquivo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#16829E] hover:text-[#126a7e] flex items-center"
                        >
                          <FaFilePdf className="mr-1" />
                          Visualizar
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Controle de Receitas */}
      {isControleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#16829E]">
                Controle de Medicamentos
              </h2>
              <button
                onClick={() => setIsControleModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(medicamentosAgrupados).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medicamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade Mensal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(medicamentosAgrupados).map(
                        ([medicamento, quantidade]) => (
                          <tr key={medicamento}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {medicamento}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {quantidade} unidades
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Nenhum medicamento encontrado em receitas aprovadas.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <ModalReceitas
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
        onUploadSuccess={recarregarReceitas}
      />
    </MainLayout>
  );
}
