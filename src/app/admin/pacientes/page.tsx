"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import ButtonComponent from "@/components/ui/Button";
import { useAuthSession } from "@/hooks/useAuthSession";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Interface para dados da API externa
interface ApiPacienteData {
  id: number | string;
  identifier?: string;
  name: string;
  dateOfBirth: string;
  cpf: string;
  gender: string;
  phone: string;
  observations?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  email: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  cityId?: number;
  stateId?: number;
  zipCode?: string;
  companyId?: number;
  doctorId?: number;
}

interface Paciente extends Record<string, unknown> {
  id: string;
  identifier: string;
  name: string;
  date_of_birth: string;
  cpf: string;
  gender: string;
  phone: string;
  observations: string;
  status: "ativo" | "inativo" | "pendente";
  email: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city_id: number;
  state_id: number;
  zip_code: string;
  company_id: number;
  doctor_id: number;
}

// Função para mapear dados da API para o formato da interface
const mapApiDataToPaciente = (apiData: ApiPacienteData): Paciente => {
  console.log("🔄 Mapeando dados da API:", apiData);

  const mapped = {
    id: apiData.id?.toString() || "",
    identifier: apiData.identifier || `PAC${apiData.id}`,
    name: apiData.name || "",
    date_of_birth: apiData.dateOfBirth || "",
    cpf: apiData.cpf || "",
    gender: apiData.gender || "",
    phone: apiData.phone || "",
    observations: apiData.observations || "",
    status: (apiData.status === "ACTIVE"
      ? "ativo"
      : apiData.status === "INACTIVE"
      ? "inativo"
      : "pendente") as "ativo" | "inativo" | "pendente",
    email: apiData.email || "",
    street: apiData.street || "",
    number: apiData.number || "",
    complement: apiData.complement || "",
    neighborhood: apiData.neighborhood || "",
    city_id: apiData.cityId || 0,
    state_id: apiData.stateId || 0,
    zip_code: apiData.zipCode || "",
    company_id: apiData.companyId || 0,
    doctor_id: apiData.doctorId || 0,
  };

  console.log("✅ Dados mapeados:", mapped);
  return mapped;
};

// Função utilitária para formatar CPF
function formatCpf(cpf: string) {
  if (!cpf) return "";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9
    )}-${digits.slice(9)}`;
  }
  return cpf;
}

// Função utilitária para formatar telefone
function formatPhone(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

// Função para criar badges de status seguindo o padrão das outras páginas
const getStatusBadge = (status: Paciente["status"]) => {
  const statusConfig = {
    ativo: {
      color: "bg-green-500",
      text: "Ativo",
      bgClass: "bg-green-50 text-green-700 border-green-200",
    },
    inativo: {
      color: "bg-red-500",
      text: "Inativo",
      bgClass: "bg-red-50 text-red-700 border-red-200",
    },
    pendente: {
      color: "bg-yellow-500",
      text: "Pendente",
      bgClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
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

export default function PacientesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthSession();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  // Estados dos filtros
  const [filterCpf, setFilterCpf] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  const [filterPhone, setFilterPhone] = useState<string>("");
  const [filterEmail, setFilterEmail] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPacientes = useCallback(
    async (
      filters?: {
        cpf?: string;
        name?: string;
        phone?: string;
        email?: string;
        status?: string;
      },
      page: number = 1,
      perPage: number = 10
    ) => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.accessToken) {
          console.log("❌ Token de acesso não encontrado");
          setError("Token de acesso não encontrado. Faça login novamente.");
          return;
        }

        console.log("🚀 Buscando pacientes via proxy...");
        console.log(`🔑 Token: ${user.accessToken?.substring(0, 20)}...`);

        // Construir query parameters
        const params = new URLSearchParams();
        if (filters?.cpf) params.append("cpf", filters.cpf);
        if (filters?.name) params.append("name", filters.name);
        if (filters?.phone) params.append("phone", filters.phone);
        if (filters?.email) params.append("email", filters.email);
        if (filters?.status) {
          // Converter status para formato da API
          const apiStatus =
            filters.status === "ativo"
              ? "ACTIVE"
              : filters.status === "inativo"
              ? "INACTIVE"
              : filters.status === "pendente"
              ? "SUSPENDED"
              : "";
          if (apiStatus) params.append("status", apiStatus);
        }

        // Adicionar parâmetros de paginação
        params.append("page", page.toString());
        params.append("per_page", perPage.toString());

        const url = `/api/proxy/patients${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        console.log(`📡 URL da requisição: ${url}`);

        // Usar o proxy da API do Next.js para evitar problemas de CORS
        const response = await fetch(url, {
          method: "GET",
        });

        console.log(`📡 Status da resposta: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`📊 Dados recebidos:`, data);

          // Verificar se a resposta é um array de pacientes ou objeto com dados paginados
          let pacientesData: Paciente[] = [];
          let totalCount = 0;

          if (Array.isArray(data)) {
            // Resposta direta como array
            pacientesData = data;
            totalCount = data.length;
          } else if (data && typeof data === "object" && "data" in data) {
            // Resposta paginada com estrutura { data: [], total: number, page: number, etc }
            pacientesData = Array.isArray(data.data) ? data.data : [];
            totalCount = data.total || data.total_count || pacientesData.length;
          } else {
            console.log("❌ Formato de resposta não reconhecido:", data);
            setPacientes([]);
            setTotalItems(0);
            return;
          }

          console.log(`✅ ${pacientesData.length} pacientes encontrados`);

          // Mapear dados para o formato esperado
          const pacientesMapeados = pacientesData.map((item) =>
            mapApiDataToPaciente(item as unknown as ApiPacienteData)
          );
          setPacientes(pacientesMapeados);
          setTotalItems(totalCount);

          console.log(
            `✅ Pacientes carregados com sucesso:`,
            pacientesMapeados
          );
          console.log(`📊 Total de itens: ${totalCount}`);
        } else {
          console.log(`❌ Erro na resposta: ${response.status}`);
          const errorText = await response.text();
          console.log(`❌ Erro detalhado:`, errorText);
          setError(
            `Erro ao buscar pacientes (${response.status}): ${errorText}`
          );
        }
      } catch (error) {
        console.error("❌ Erro ao carregar pacientes:", error);
        setError(
          "Erro ao carregar pacientes. Verifique sua conexão e tente novamente."
        );
      } finally {
        setLoading(false);
      }
    },
    [user?.accessToken]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchPacientes({}, currentPage, 10);
    }
  }, [isAuthenticated, fetchPacientes, currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;

    try {
      console.log(`🗑️ Deletando paciente ID: ${id}`);

      const response = await fetch(`/api/proxy/patients?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`✅ Paciente deletado com sucesso`);
        // Remover paciente da lista local
        setPacientes(pacientes.filter((p) => p.id !== id));
      } else {
        const errorData = await response.json();
        console.error(`❌ Erro ao deletar paciente:`, errorData);
        setError(errorData.error || "Erro ao deletar paciente.");
      }
    } catch (error) {
      console.error("❌ Erro ao excluir paciente:", error);
      setError("Erro ao excluir paciente. Tente novamente.");
    }
  };

  const handleEdit = (paciente: Paciente) => {
    router.push(`/admin/pacientes/${paciente.id}`);
  };

  const handleView = (paciente: Paciente) => {
    // Aqui seria redirecionado para página de visualização
    console.log("Visualizar paciente:", paciente);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  // Função para executar pesquisa com filtros
  const handleSearch = () => {
    setCurrentPage(1); // Resetar para primeira página
    const filters: {
      cpf?: string;
      name?: string;
      phone?: string;
      email?: string;
      status?: string;
    } = {};

    // Adicionar apenas filtros que não estão vazios
    if (filterCpf.trim()) filters.cpf = filterCpf.trim();
    if (filterName.trim()) filters.name = filterName.trim();
    if (filterPhone.trim()) filters.phone = filterPhone.trim();
    if (filterEmail.trim()) filters.email = filterEmail.trim();
    if (filterStatus) filters.status = filterStatus;

    console.log("🔍 Filtros aplicados:", filters);

    fetchPacientes(filters, 1, 10);
  };

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const filters = {
      cpf: filterCpf.trim() || undefined,
      name: filterName.trim() || undefined,
      phone: filterPhone.trim() || undefined,
      email: filterEmail.trim() || undefined,
      status: filterStatus || undefined,
    };
    fetchPacientes(filters, page, 10);
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilterCpf("");
    setFilterName("");
    setFilterPhone("");
    setFilterEmail("");
    setFilterStatus("");
    setCurrentPage(1); // Resetar para primeira página
    fetchPacientes({}, 1, 10); // Buscar todos os pacientes
  };

  // Fatiar pacientes para exibir apenas 10 por página
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const pacientesPaginados = pacientes.slice(startIndex, endIndex);

  // Verificar se o usuário está autenticado
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
            <ButtonComponent
              onClick={() => router.push("/login")}
              variant="primary"
              size="md"
            >
              Fazer Login
            </ButtonComponent>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 bg-transparent min-h-screen p-2 md:p-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Gerenciar Pacientes
          </h1>
          <p className="text-gray-600 text-sm">
            Visualize e gerencie todos os pacientes cadastrados no sistema
          </p>
        </div>

        {/* Stats Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">
                Resumo dos Pacientes
              </h3>
              <ButtonComponent
                onClick={() => router.push("/admin/pacientes/novo")}
                variant="success"
                size="md"
                icon={<AddIcon fontSize="small" />}
              >
                Novo Paciente
              </ButtonComponent>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {pacientes.length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Total
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {pacientes.filter((p) => p.status === "ativo").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Ativos
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {pacientes.filter((p) => p.status === "inativo").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Inativos
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {pacientes.filter((p) => p.status === "pendente").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Pendentes
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
                  { value: "ativo", label: "Ativo" },
                  { value: "inativo", label: "Inativo" },
                  { value: "pendente", label: "Pendente" },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <ButtonComponent
              onClick={handleSearch}
              variant="primary"
              size="md"
              icon={<SearchIcon fontSize="small" />}
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
            <ButtonComponent
              onClick={() => {
                setError(null);
                fetchPacientes();
              }}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              Tentar novamente
            </ButtonComponent>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pacientes Encontrados
            </h3>
          </div>
          <Table
            data={pacientesPaginados}
            columns={[
              {
                key: "name",
                header: "Nome",
                render: (paciente) => (
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {paciente.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {paciente.email}
                    </div>
                  </div>
                ),
              },
              {
                key: "cpf",
                header: "CPF",
                render: (paciente) => (
                  <span className="text-sm text-gray-700">
                    {formatCpf(paciente.cpf)}
                  </span>
                ),
              },
              {
                key: "date_of_birth",
                header: "Data Nascimento",
                render: (paciente) => (
                  <span className="text-sm text-gray-700">
                    {formatDate(paciente.date_of_birth)}
                  </span>
                ),
              },
              {
                key: "phone",
                header: "Telefone",
                render: (paciente) => (
                  <span className="text-sm text-gray-700">
                    {formatPhone(paciente.phone)}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (paciente) => getStatusBadge(paciente.status),
              },
            ]}
            actions={[
              {
                label: "Visualizar",
                icon: <VisibilityIcon fontSize="small" />,
                onClick: handleView,
                variant: "primary",
              },
              {
                label: "Editar",
                icon: <EditIcon fontSize="small" />,
                onClick: handleEdit,
                variant: "secondary",
              },
              {
                label: "Excluir",
                icon: <DeleteIcon fontSize="small" />,
                onClick: (paciente) => handleDelete(paciente.id),
                variant: "danger",
              },
            ]}
            emptyMessage="Nenhum paciente encontrado"
            loading={loading}
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
