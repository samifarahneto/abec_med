"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { Table } from "@/components/ui/Table";
import ButtonComponent from "@/components/ui/Button";
import { useAuthSession } from "@/hooks/useAuthSession";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Interface para dados da API externa
interface ApiMedicoData {
  id: number | string;
  name: string;
  documentDoctorType: string;
  documentDoctorNumber: string;
  documentDoctorUf: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

interface Medico extends Record<string, unknown> {
  id: string;
  name: string;
  documentDoctorType: string;
  documentDoctorNumber: string;
  documentDoctorUf: string;
  phone: string;
  email: string;
  status: "ativo" | "inativo" | "pendente";
  created_at: string;
}

// Função para mapear dados da API para o formato da interface
const mapApiDataToMedico = (apiData: ApiMedicoData): Medico => {
  console.log("🔄 Mapeando dados da API:", apiData);

  const mapped = {
    id: apiData.id?.toString() || "",
    name: apiData.name || "",
    documentDoctorType: apiData.documentDoctorType || "",
    documentDoctorNumber: apiData.documentDoctorNumber || "",
    documentDoctorUf: apiData.documentDoctorUf || "",
    phone: apiData.phone || "",
    email: apiData.email || "",
    status: (apiData.status === "ACTIVE" ? "ativo" : "inativo") as
      | "ativo"
      | "inativo",
    created_at: apiData.created_at || "",
  };

  console.log("✅ Dados mapeados:", mapped);
  return mapped;
};

export default function MedicosPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthSession();
  const [medicos, setMedicos] = useState<Medico[]>([]);

  // Estados dos filtros
  const [filterCpf, setFilterCpf] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  const [filterPhone, setFilterPhone] = useState<string>("");
  const [filterDocumentDoctorType, setFilterDocumentDoctorType] =
    useState<string>("");
  const [filterDocumentDoctorNumber, setFilterDocumentDoctorNumber] =
    useState<string>("");
  const [filterEmail, setFilterEmail] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicos = useCallback(
    async (filters?: {
      cpf?: string;
      name?: string;
      phone?: string;
      documentDoctorType?: string;
      documentDoctorNumber?: string;
      email?: string;
      status?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.accessToken) {
          console.log("❌ Token de acesso não encontrado");
          setError("Token de acesso não encontrado. Faça login novamente.");
          return;
        }

        console.log("🚀 Buscando médicos via proxy...");
        console.log(`🔑 Token: ${user.accessToken?.substring(0, 20)}...`);

        // Construir query parameters
        const params = new URLSearchParams();
        if (filters?.cpf) params.append("cpf", filters.cpf);
        if (filters?.name) params.append("name", filters.name);
        if (filters?.phone) params.append("phone", filters.phone);
        if (filters?.documentDoctorType)
          params.append("documentDoctorType", filters.documentDoctorType);
        if (filters?.documentDoctorNumber)
          params.append("documentDoctorNumber", filters.documentDoctorNumber);
        if (filters?.email) params.append("email", filters.email);
        if (filters?.status) {
          // Converter status para formato da API
          const apiStatus =
            filters.status === "ativo"
              ? "ACTIVE"
              : filters.status === "inativo"
              ? "INACTIVE"
              : "";
          if (apiStatus) params.append("status", apiStatus);
        }

        const url = `/api/proxy/doctors${
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

          // Verificar se a resposta é um array de médicos
          if (Array.isArray(data) && data.length > 0) {
            console.log(`✅ ${data.length} médicos encontrados`);

            // Mapear dados para o formato esperado
            const medicosMapeados = data.map(mapApiDataToMedico);
            setMedicos(medicosMapeados);

            console.log(`✅ Médicos carregados com sucesso:`, medicosMapeados);
          } else {
            console.log("❌ Resposta não contém dados de médicos:", data);
            setMedicos([]);
          }
        } else {
          console.log(`❌ Erro na resposta: ${response.status}`);
          const errorText = await response.text();
          console.log(`❌ Erro detalhado:`, errorText);
          setError(`Erro ao buscar médicos (${response.status}): ${errorText}`);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar médicos:", error);
        setError(
          "Erro ao carregar médicos. Verifique sua conexão e tente novamente."
        );
      } finally {
        setLoading(false);
      }
    },
    [user?.accessToken]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedicos();
    }
  }, [isAuthenticated, fetchMedicos]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este médico?")) return;

    try {
      console.log(`🗑️ Deletando médico ID: ${id}`);

      const response = await fetch(`/api/proxy/doctors?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`✅ Médico deletado com sucesso`);
        // Remover médico da lista local
        setMedicos(medicos.filter((m) => m.id !== id));
      } else {
        const errorData = await response.json();
        console.error(`❌ Erro ao deletar médico:`, errorData);
        setError(errorData.error || "Erro ao deletar médico.");
      }
    } catch (error) {
      console.error("❌ Erro ao excluir médico:", error);
      setError("Erro ao excluir médico. Tente novamente.");
    }
  };

  const handleEdit = (medico: Medico) => {
    router.push(`/admin/medicos/${medico.id}`);
  };

  const handleView = (medico: Medico) => {
    // Aqui seria redirecionado para página de visualização
    console.log("Visualizar médico:", medico);
  };

  // Função para executar pesquisa com filtros
  const handleSearch = () => {
    const filters: {
      cpf?: string;
      name?: string;
      phone?: string;
      documentDoctorType?: string;
      documentDoctorNumber?: string;
      email?: string;
      status?: string;
    } = {};

    // Adicionar apenas filtros que não estão vazios
    if (filterCpf.trim()) filters.cpf = filterCpf.trim();
    if (filterName.trim()) filters.name = filterName.trim();
    if (filterPhone.trim()) filters.phone = filterPhone.trim();
    if (filterDocumentDoctorType.trim())
      filters.documentDoctorType = filterDocumentDoctorType.trim();
    if (filterDocumentDoctorNumber.trim())
      filters.documentDoctorNumber = filterDocumentDoctorNumber.trim();
    if (filterEmail.trim()) filters.email = filterEmail.trim();
    if (filterStatus) filters.status = filterStatus;

    console.log("🔍 Filtros aplicados:", filters);
    fetchMedicos(filters);
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilterCpf("");
    setFilterName("");
    setFilterPhone("");
    setFilterDocumentDoctorType("");
    setFilterDocumentDoctorNumber("");
    setFilterEmail("");
    setFilterStatus("");
    fetchMedicos(); // Buscar todos os médicos
  };

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
      <div className="space-y-6 bg-[#f5f7fa] min-h-screen p-2 md:p-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Gerenciar Médicos
          </h1>
          <p className="text-gray-600 text-sm">
            Visualize e gerencie todos os médicos cadastrados no sistema
          </p>
        </div>

        {/* Stats Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">
                Resumo dos Médicos
              </h3>
              <ButtonComponent
                onClick={() => router.push("/admin/medicos/novo")}
                variant="success"
                size="md"
                icon={<AddIcon fontSize="small" />}
              >
                Novo Médico
              </ButtonComponent>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {medicos.length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Total
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {medicos.filter((m) => m.status === "ativo").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Ativos
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-yellow-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {medicos.filter((m) => m.status === "inativo").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Inativos
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {medicos.filter((m) => m.status === "pendente").length}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
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
                label="Nome"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Nome do médico"
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
              <FormSelect
                label="Tipo de Documento"
                value={filterDocumentDoctorType}
                onChange={(e) => setFilterDocumentDoctorType(e.target.value)}
                options={[
                  { value: "", label: "Todos os tipos" },
                  { value: "CRM", label: "CRM" },
                  { value: "CRMV", label: "CRMV" },
                ]}
              />
            </div>
            <div className="form-group">
              <FormInput
                label="Número do Documento"
                value={filterDocumentDoctorNumber}
                onChange={(e) => setFilterDocumentDoctorNumber(e.target.value)}
                placeholder="Número do documento"
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
              <FormSelect
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "", label: "Todos os status" },
                  { value: "ativo", label: "Ativo" },
                  { value: "inativo", label: "Inativo" },
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
                fetchMedicos();
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
              Médicos Encontrados
            </h3>
          </div>
          <Table
            data={medicos}
            columns={[
              {
                key: "name",
                header: "Nome",
                render: (medico) => (
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {medico.name}
                    </div>
                    <div className="text-xs text-gray-500">{medico.email}</div>
                  </div>
                ),
              },
              {
                key: "documentDoctorNumber",
                header: "Documento",
                render: (medico) => (
                  <div>
                    <div className="text-sm text-gray-700">
                      {medico.documentDoctorType}
                      {medico.documentDoctorNumber}/{medico.documentDoctorUf}
                    </div>
                  </div>
                ),
              },
              {
                key: "phone",
                header: "Telefone",
                render: (medico) => (
                  <span className="text-sm text-gray-700">{medico.phone}</span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (medico) => (
                  <span
                    className={`px-4 py-1 rounded-2xl text-xs font-bold uppercase tracking-wide ${
                      medico.status === "ativo"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {medico.status === "ativo" ? "ATIVO" : "INATIVO"}
                  </span>
                ),
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
                onClick: (medico) => handleDelete(medico.id),
                variant: "danger",
              },
            ]}
            emptyMessage="Nenhum médico encontrado"
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
}
