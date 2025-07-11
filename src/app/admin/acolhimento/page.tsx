"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import ButtonComponent from "@/components/ui/Button";

interface Acolhimento extends Record<string, unknown> {
  id: string;
  paciente_id: string;
  paciente_nome: string;
  paciente_cpf: string;
  telefone: string;
  medico_nome: string;
  tipo_consulta: string;
  hora_chegada: string;
  hora_agendada: string;
  prioridade: "baixa" | "media" | "alta" | "urgente";
  status: "ACTIVE" | "INACTIVE";
  permissoes: ("THC" | "CBD")[];
  observacoes: string;
  data_atendimento: string;
}

// Função para criar badges de status seguindo o padrão das outras páginas
const getStatusBadge = (status: Acolhimento["status"]) => {
  const statusConfig = {
    ACTIVE: {
      color: "bg-green-500",
      text: "Ativo",
      bgClass: "bg-green-50 text-green-700 border-green-200",
    },
    INACTIVE: {
      color: "bg-red-500",
      text: "Inativo",
      bgClass: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bgClass}`}
    >
      <span className={`w-2 h-2 ${config.color} rounded-full mr-1`}></span>
      {config.text}
    </span>
  );
};

// Função para formatar CPF
const formatCPF = (cpf: string) => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, "");
  // Aplica máscara
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export default function AcolhimentoPage() {
  const router = useRouter();
  const [atendimentos, setAtendimentos] = useState<Acolhimento[]>([]);
  const [filteredAtendimentos, setFilteredAtendimentos] = useState<
    Acolhimento[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados dos filtros
  const [filterCpf, setFilterCpf] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchAtendimentos();
  }, []);

  // Inicializar dados filtrados quando os atendimentos são carregados
  useEffect(() => {
    setFilteredAtendimentos(atendimentos);
    setTotalItems(atendimentos.length);
  }, [atendimentos]);

  const fetchAtendimentos = async () => {
    try {
      setLoading(true);
      // Simulando dados de acolhimento
      const mockAtendimentos: Acolhimento[] = [
        {
          id: "1",
          paciente_id: "PAC001",
          paciente_nome: "Maria Silva Santos",
          paciente_cpf: "123.456.789-00",
          telefone: "(11) 99999-0001",
          medico_nome: "Dr. João Carvalho",
          tipo_consulta: "Consulta de Rotina",
          hora_chegada: "08:15",
          hora_agendada: "08:30",
          prioridade: "media",
          status: "ACTIVE",
          permissoes: ["THC", "CBD"],
          observacoes: "Primeira consulta, paciente nervosa",
          data_atendimento: "2024-01-15",
        },
        {
          id: "2",
          paciente_id: "PAC002",
          paciente_nome: "João Pedro Oliveira",
          paciente_cpf: "987.654.321-00",
          telefone: "(11) 99999-0002",
          medico_nome: "Dra. Ana Santos",
          tipo_consulta: "Retorno",
          hora_chegada: "09:00",
          hora_agendada: "09:00",
          prioridade: "baixa",
          status: "ACTIVE",
          permissoes: ["CBD"],
          observacoes: "Paciente pontual, retorno de hipertensão",
          data_atendimento: "2024-01-15",
        },
        {
          id: "3",
          paciente_id: "PAC003",
          paciente_nome: "Ana Carolina Ferreira",
          paciente_cpf: "456.789.123-00",
          telefone: "(11) 99999-0003",
          medico_nome: "Dr. Carlos Silva",
          tipo_consulta: "Consulta Especializada",
          hora_chegada: "10:45",
          hora_agendada: "11:00",
          prioridade: "alta",
          status: "ACTIVE",
          permissoes: ["THC"],
          observacoes: "Dor no peito, verificar sinais vitais",
          data_atendimento: "2024-01-15",
        },
        {
          id: "4",
          paciente_id: "PAC004",
          paciente_nome: "Roberto Lima Souza",
          paciente_cpf: "789.123.456-00",
          telefone: "(11) 99999-0004",
          medico_nome: "Dra. Marina Costa",
          tipo_consulta: "Emergência",
          hora_chegada: "07:30",
          hora_agendada: "08:00",
          prioridade: "urgente",
          status: "INACTIVE",
          permissoes: ["THC", "CBD"],
          observacoes: "Atendimento de urgência concluído",
          data_atendimento: "2024-01-15",
        },
      ];

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAtendimentos(mockAtendimentos);
      setTotalItems(mockAtendimentos.length);
    } catch (error) {
      setError("Erro ao carregar dados de acolhimento");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para executar pesquisa com filtros
  const handleSearch = () => {
    setCurrentPage(1); // Resetar para primeira página

    const filtered = atendimentos.filter(
      (atendimento) =>
        (filterName === "" ||
          String(atendimento.paciente_nome)
            .toLowerCase()
            .includes(filterName.toLowerCase())) &&
        (filterCpf === "" ||
          String(atendimento.paciente_cpf).includes(filterCpf)) &&
        (filterPhone === "" ||
          String(atendimento.telefone).includes(filterPhone)) &&
        (filterEmail === "" ||
          String(atendimento.email || "")
            .toLowerCase()
            .includes(filterEmail.toLowerCase())) &&
        (filterStatus === "" || atendimento.status === filterStatus)
    );

    setFilteredAtendimentos(filtered);
    setTotalItems(filtered.length);

    console.log("🔍 Filtros aplicados:", {
      cpf: filterCpf,
      name: filterName,
      phone: filterPhone,
      email: filterEmail,
      status: filterStatus,
    });
    console.log(`✅ ${filtered.length} atendimentos encontrados`);
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilterCpf("");
    setFilterName("");
    setFilterPhone("");
    setFilterEmail("");
    setFilterStatus("");
    setCurrentPage(1); // Resetar para primeira página
    setFilteredAtendimentos(atendimentos); // Mostrar todos os atendimentos
    setTotalItems(atendimentos.length);
  };

  // Fatiar atendimentos filtrados para exibir apenas 10 por página
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const atendimentosPaginados = filteredAtendimentos.slice(
    startIndex,
    endIndex
  );

  const columns = [
    {
      key: "paciente_nome" as keyof Acolhimento,
      header: "Nome",
      render: (atendimento: Record<string, unknown>) => (
        <span className="text-gray-900 text-sm font-medium">
          {(atendimento as Acolhimento).paciente_nome}
        </span>
      ),
    },
    {
      key: "paciente_cpf" as keyof Acolhimento,
      header: "CPF",
      render: (atendimento: Record<string, unknown>) => (
        <span className="text-gray-900 text-sm font-medium">
          {formatCPF((atendimento as Acolhimento).paciente_cpf)}
        </span>
      ),
    },
    {
      key: "telefone" as keyof Acolhimento,
      header: "Telefone",
      render: (atendimento: Record<string, unknown>) => (
        <span className="text-gray-900 text-sm font-medium">
          {(atendimento as Acolhimento).telefone || "-"}
        </span>
      ),
    },
    {
      key: "status" as keyof Acolhimento,
      header: "Status",
      render: (atendimento: Record<string, unknown>) =>
        getStatusBadge((atendimento as Acolhimento).status),
    },
  ];

  const handleEdit = (atendimento: Acolhimento) => {
    // Aqui seria redirecionado para página de edição do agendamento
    console.log("Editar agendamento:", atendimento);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      // Aqui seria a chamada para a API real
      setAtendimentos(atendimentos.filter((a) => a.id !== id));
      setTotalItems((prev) => prev - 1);
    } catch (error) {
      setError("Erro ao excluir agendamento");
      console.error("Erro:", error);
    }
  };

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Aqui seria feita a chamada para a API com os parâmetros de paginação
    console.log(`Navegando para página ${page}`);
  };

  const actions = [
    {
      label: "Editar",
      icon: <FaEdit className="w-4 h-4" />,
      onClick: (atendimento: Record<string, unknown>) =>
        handleEdit(atendimento as Acolhimento),
      variant: "primary" as const,
    },
    {
      label: "Excluir",
      icon: <FaTrash className="w-4 h-4" />,
      onClick: (atendimento: Record<string, unknown>) =>
        handleDelete((atendimento as Acolhimento).id),
      variant: "danger" as const,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 bg-transparent min-h-screen p-2 md:p-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Gerenciar Acolhimento
          </h1>
          <p className="text-gray-600 text-sm">
            Visualize e gerencie o fluxo de atendimento e triagem de pacientes
          </p>
        </div>

        {/* Stats Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">
                Resumo do Acolhimento
              </h3>
              <ButtonComponent
                onClick={() => router.push("/admin/acolhimento/novo")}
                variant="success"
                size="md"
                icon={<FaPlus fontSize="small" />}
              >
                Novo Acolhimento
              </ButtonComponent>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {atendimentos.filter((a) => a.status === "ACTIVE").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Ativos
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {atendimentos.filter((a) => a.status === "INACTIVE").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Inativos
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filtros de Pesquisa
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
            <div className="form-group">
              <FormInput
                label="CPF"
                value={filterCpf}
                onChange={(e) => setFilterCpf(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="form-group">
              <FormInput
                label="Telefone"
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="form-group">
              <FormInput
                label="Email"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                placeholder="exemplo@email.com"
              />
            </div>
            <div className="form-group">
              <FormInput
                label="Nome"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Nome do paciente"
              />
            </div>
            <div className="form-group">
              <FormSelect
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "", label: "Todos os status" },
                  { value: "ACTIVE", label: "Ativo" },
                  { value: "INACTIVE", label: "Inativo" },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <ButtonComponent
              onClick={handleSearch}
              variant="primary"
              size="md"
              icon={<FaSearch fontSize="small" />}
            >
              Pesquisar
            </ButtonComponent>
            <ButtonComponent
              onClick={handleClearFilters}
              variant="secondary"
              size="md"
            >
              Limpar Filtros
            </ButtonComponent>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Atendimentos Encontrados
            </h3>
          </div>
          <Table
            data={atendimentosPaginados}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyMessage="Nenhum atendimento encontrado para hoje"
          />

          {/* Componente de Paginação */}
          {!loading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / 10)}
              totalItems={totalItems}
              itemsPerPage={10}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
