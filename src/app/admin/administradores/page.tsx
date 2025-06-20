"use client";

import { useState, useEffect } from "react";
import {
  FaUserShield,
  FaCog,
  FaKey,
  FaUserCheck,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import { Input, Table, Button } from "@/components/ui";

interface Administrador extends Record<string, unknown> {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  telefone: string;
  nivel_acesso: "master" | "admin";
  status: "ativo" | "inativo";
  ultimo_acesso: string;
  data_cadastro: string;
}

export default function AdministradoresPage() {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdministradores();
  }, []);

  const fetchAdministradores = async () => {
    try {
      setLoading(true);
      // Simulando dados de administradores
      const mockAdministradores: Administrador[] = [
        {
          id: "1",
          nome: "Admin Sistema",
          email: "admin@system.com.br",
          cargo: "Administrador Principal",
          telefone: "(11) 99999-0001",
          nivel_acesso: "master",
          status: "ativo",
          ultimo_acesso: "2024-01-20",
          data_cadastro: "2024-01-01",
        },
        {
          id: "2",
          nome: "Carlos Roberto Silva",
          email: "carlos.silva@abecmed.com.br",
          cargo: "Coordenador Técnico",
          telefone: "(11) 99999-0002",
          nivel_acesso: "admin",
          status: "ativo",
          ultimo_acesso: "2024-01-19",
          data_cadastro: "2024-01-05",
        },
        {
          id: "3",
          nome: "Ana Paula Santos",
          email: "ana.santos@abecmed.com.br",
          cargo: "Supervisora Administrativa",
          telefone: "(11) 99999-0003",
          nivel_acesso: "admin",
          status: "ativo",
          ultimo_acesso: "2024-01-18",
          data_cadastro: "2024-01-08",
        },
        {
          id: "4",
          nome: "Ricardo Mendes",
          email: "ricardo.mendes@abecmed.com.br",
          cargo: "Administrador",
          telefone: "(11) 99999-0004",
          nivel_acesso: "admin",
          status: "inativo",
          ultimo_acesso: "2024-01-10",
          data_cadastro: "2024-01-03",
        },
      ];

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAdministradores(mockAdministradores);
    } catch (error) {
      setError("Erro ao carregar administradores");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelAcessoBadge = (nivel: Administrador["nivel_acesso"]) => {
    const nivelConfig = {
      master: {
        color: "bg-red-500",
        text: "Master",
        bgClass: "bg-red-50 text-red-700 border-red-200",
      },
      admin: {
        color: "bg-blue-500",
        text: "Admin",
        bgClass: "bg-blue-50 text-blue-700 border-blue-200",
      },
    };

    const config = nivelConfig[nivel];

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bgClass}`}
      >
        <span className={`w-2 h-2 ${config.color} rounded-full mr-1`}></span>
        {config.text}
      </span>
    );
  };

  const handleEdit = (administrador: Administrador) => {
    // Aqui seria redirecionado para página de edição do administrador
    console.log("Editar administrador:", administrador);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este administrador?")) return;

    try {
      // Aqui seria a chamada para a API real
      setAdministradores(administradores.filter((a) => a.id !== id));
    } catch (error) {
      setError("Erro ao excluir administrador");
      console.error("Erro:", error);
    }
  };

  const filteredAdministradores = administradores.filter(
    (admin) =>
      String(admin.nome).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(admin.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(admin.cargo).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(admin.nivel_acesso)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "nome" as keyof Administrador,
      header: "Nome",
      render: (admin: Administrador) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(admin.nome)}
        </span>
      ),
    },
    {
      key: "email" as keyof Administrador,
      header: "Email",
      render: (admin: Administrador) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(admin.email)}
        </span>
      ),
    },
    {
      key: "nivel_acesso" as keyof Administrador,
      header: "Nível de Acesso",
      render: (admin: Administrador) => getNivelAcessoBadge(admin.nivel_acesso),
    },
  ];

  const actions = [
    {
      label: "Editar",
      icon: <FaEdit className="w-4 h-4" />,
      onClick: handleEdit,
      variant: "primary" as const,
    },
    {
      label: "Excluir",
      icon: <FaTrash className="w-4 h-4" />,
      onClick: (admin: Administrador) => handleDelete(admin.id),
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
              Administradores
            </h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Gerencie os administradores do sistema
            </p>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar por nome, email, cargo ou nível de acesso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={() => {
                /* Funcionalidade para cadastrar novo administrador */
              }}
              icon={<FaPlus />}
              variant="primary"
              size="md"
              className="whitespace-nowrap"
            >
              Cadastrar Administrador
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
                  <FaUserShield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {administradores.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaUserCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {administradores.filter((a) => a.status === "ativo").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaKey className="w-4 h-4 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Masters</p>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      administradores.filter((a) => a.nivel_acesso === "master")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaCog className="w-4 h-4 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      administradores.filter((a) => a.nivel_acesso === "admin")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Table
          data={filteredAdministradores}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum administrador encontrado"
          mobileCardRender={(admin: Administrador) => (
            <div className="bg-white rounded-lg p-4 shadow-sm border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaUserShield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-sm font-medium">
                      {String(admin.nome)}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {String(admin.email)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {getNivelAcessoBadge(admin.nivel_acesso)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Cargo:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(admin.cargo)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Telefone:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(admin.telefone)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => action.onClick(admin)}
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
