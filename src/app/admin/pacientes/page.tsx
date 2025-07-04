"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import { Input, Table, Button } from "@/components/ui";
import { useAuthSession } from "@/hooks/useAuthSession";

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
  status: "ativo" | "inativo" | "suspenso";
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
      : "suspenso") as "ativo" | "inativo" | "suspenso",
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

export default function PacientesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthSession();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = useCallback(async () => {
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

      // Usar o proxy da API do Next.js para evitar problemas de CORS
      const response = await fetch("/api/proxy/patients", {
        method: "GET",
      });

      console.log(`📡 Status da resposta: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`📊 Dados recebidos:`, data);

        // Verificar se a resposta é um array de pacientes
        if (Array.isArray(data) && data.length > 0) {
          console.log(`✅ ${data.length} pacientes encontrados`);

          // Mapear dados para o formato esperado
          const pacientesMapeados = data.map(mapApiDataToPaciente);
          setPacientes(pacientesMapeados);

          console.log(
            `✅ Pacientes carregados com sucesso:`,
            pacientesMapeados
          );
        } else {
          console.log("❌ Resposta não contém dados de pacientes:", data);
          setError("Nenhum paciente encontrado.");
        }
      } else {
        console.log(`❌ Erro na resposta: ${response.status}`);
        const errorText = await response.text();
        console.log(`❌ Erro detalhado:`, errorText);
        setError(`Erro ao buscar pacientes (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar pacientes:", error);
      setError(
        "Erro ao carregar pacientes. Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPacientes();
    }
  }, [isAuthenticated, fetchPacientes]);

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

  const getStatusBadge = (status: Paciente["status"]) => {
    const statusConfig = {
      ativo: {
        color: "bg-emerald-500",
        text: "Ativo",
        bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      inativo: {
        color: "bg-yellow-500",
        text: "Inativo",
        bgClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      suspenso: {
        color: "bg-red-500",
        text: "Suspenso",
        bgClass: "bg-red-50 text-red-700 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.inativo;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bgClass}`}
      >
        <span
          className={`w-2 h-2 ${config.color} rounded-full mr-2 animate-pulse`}
        ></span>
        {config.text}
      </span>
    );
  };

  const filteredPacientes = pacientes.filter(
    (paciente) =>
      String(paciente.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(paciente.identifier)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(paciente.cpf).includes(searchTerm) ||
      String(paciente.phone).includes(searchTerm) ||
      String(paciente.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "name" as keyof Paciente,
      header: "Nome",
      render: (paciente: Paciente) => (
        <div className="text-center">
          <div className="text-gray-900 text-sm font-medium">
            {String(paciente.name)}
          </div>
          <div className="text-gray-500 text-xs">{String(paciente.email)}</div>
        </div>
      ),
    },
    {
      key: "cpf" as keyof Paciente,
      header: "CPF",
      render: (paciente: Paciente) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(paciente.cpf)}
        </span>
      ),
    },
    {
      key: "date_of_birth" as keyof Paciente,
      header: "Data Nascimento",
      render: (paciente: Paciente) => (
        <span className="text-gray-900 text-sm font-medium">
          {formatDate(String(paciente.date_of_birth))}
        </span>
      ),
    },
    {
      key: "phone" as keyof Paciente,
      header: "Telefone",
      render: (paciente: Paciente) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(paciente.phone)}
        </span>
      ),
    },
    {
      key: "status" as keyof Paciente,
      header: "Status",
      render: (paciente: Paciente) =>
        getStatusBadge(paciente.status as "ativo" | "inativo" | "suspenso"),
    },
  ];

  const actions = [
    {
      label: "Visualizar",
      icon: <FaEye className="w-4 h-4" />,
      onClick: handleView,
      variant: "secondary" as const,
    },
    {
      label: "Editar",
      icon: <FaEdit className="w-4 h-4" />,
      onClick: handleEdit,
      variant: "primary" as const,
    },
    {
      label: "Excluir",
      icon: <FaTrash className="w-4 h-4" />,
      onClick: (paciente: Paciente) => handleDelete(paciente.id),
      variant: "danger" as const,
    },
  ];

  // Verificar se o usuário está autenticado
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
            <Button onClick={() => router.push("/login")} variant="primary">
              Fazer Login
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Pacientes
            </h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Visualize e gerencie todos os pacientes cadastrados no sistema
            </p>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar por nome, identificador, CPF, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={() => router.push("/admin/pacientes/novo")}
              icon={<FaPlus />}
              variant="primary"
              size="md"
              className="whitespace-nowrap"
            >
              Novo Paciente
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => {
                setError(null);
                fetchPacientes();
              }}
              className="ml-2 underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pacientes.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pacientes.filter((p) => p.status === "ativo").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Inativos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pacientes.filter((p) => p.status === "inativo").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Suspensos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pacientes.filter((p) => p.status === "suspenso").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Table
          data={filteredPacientes}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum paciente encontrado"
          mobileCardRender={(paciente: Paciente) => (
            <div className="bg-white rounded-lg p-4 shadow-sm border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaUser className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-sm font-medium">
                      {String(paciente.name)}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {String(paciente.email)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(
                  paciente.status as "ativo" | "inativo" | "suspenso"
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    CPF:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(paciente.cpf)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Telefone:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(paciente.phone)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Nascimento:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {formatDate(String(paciente.date_of_birth))}
                  </p>
                </div>
              </div>

              {paciente.observations && (
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Observações:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(paciente.observations)}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => action.onClick(paciente)}
                    variant={action.variant}
                    size="sm"
                    icon={action.icon}
                    title={action.label}
                  />
                ))}
              </div>
            </div>
          )}
        />
      </div>
    </MainLayout>
  );
}
