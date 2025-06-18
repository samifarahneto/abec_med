"use client";

import { useState, useEffect } from "react";
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
}

export default function PacientesPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      // Simulando dados enquanto não há API real
      const mockPacientes: Paciente[] = [
        {
          id: "1",
          identifier: "PAC001",
          name: "Maria Silva Santos",
          cpf: "123.456.789-00",
          date_of_birth: "1985-03-15",
          gender: "Feminino",
          phone: "(11) 99999-9999",
          observations: "Paciente regular, sem alergias conhecidas",
          status: "ativo",
        },
        {
          id: "2",
          identifier: "PAC002",
          name: "João Pedro Oliveira",
          cpf: "987.654.321-00",
          date_of_birth: "1990-07-22",
          gender: "Masculino",
          phone: "(11) 88888-8888",
          observations: "Hipertensão controlada",
          status: "ativo",
        },
        {
          id: "3",
          identifier: "PAC003",
          name: "Ana Carolina Ferreira",
          cpf: "456.789.123-00",
          date_of_birth: "1978-12-03",
          gender: "Feminino",
          phone: "(11) 77777-7777",
          observations: "Diabética tipo 2",
          status: "inativo",
        },
        {
          id: "4",
          identifier: "PAC004",
          name: "Roberto Lima Souza",
          cpf: "789.123.456-00",
          date_of_birth: "1965-05-18",
          gender: "Masculino",
          phone: "(11) 66666-6666",
          observations: "Cardiopata, acompanhamento especial",
          status: "suspenso",
        },
      ];

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPacientes(mockPacientes);
    } catch (error) {
      setError("Erro ao carregar pacientes");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;

    try {
      // Aqui seria a chamada para a API real
      setPacientes(pacientes.filter((p) => p.id !== id));
    } catch (error) {
      setError("Erro ao excluir paciente");
      console.error("Erro:", error);
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
    return new Date(dateString).toLocaleDateString("pt-BR");
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

    const config = statusConfig[status];

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
      String(paciente.phone).includes(searchTerm)
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
                placeholder="Buscar por nome, identificador, CPF ou telefone..."
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
