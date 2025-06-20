"use client";

import { useState, useEffect } from "react";
import {
  FaUserMd,
  FaStethoscope,
  FaGraduationCap,
  FaUserCheck,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import { Input, Table, Button } from "@/components/ui";

interface Medico extends Record<string, unknown> {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  permissoes: ("THC" | "CBD")[];
  status: "ativo" | "inativo";
  data_cadastro: string;
}

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      // Simulando dados de médicos
      const mockMedicos: Medico[] = [
        {
          id: "1",
          nome: "Dr. João Carvalho",
          crm: "CRM/SP 123456",
          especialidade: "Neurologia",
          telefone: "(11) 99999-1111",
          email: "joao.carvalho@abecmed.com.br",
          permissoes: ["THC", "CBD"],
          status: "ativo",
          data_cadastro: "2024-01-10",
        },
        {
          id: "2",
          nome: "Dra. Ana Santos",
          crm: "CRM/SP 789012",
          especialidade: "Cardiologia",
          telefone: "(11) 99999-2222",
          email: "ana.santos@abecmed.com.br",
          permissoes: ["CBD"],
          status: "ativo",
          data_cadastro: "2024-01-12",
        },
        {
          id: "3",
          nome: "Dr. Carlos Silva",
          crm: "CRM/SP 345678",
          especialidade: "Psiquiatria",
          telefone: "(11) 99999-3333",
          email: "carlos.silva@abecmed.com.br",
          permissoes: ["THC", "CBD"],
          status: "ativo",
          data_cadastro: "2024-01-15",
        },
        {
          id: "4",
          nome: "Dra. Marina Costa",
          crm: "CRM/SP 901234",
          especialidade: "Oncologia",
          telefone: "(11) 99999-4444",
          email: "marina.costa@abecmed.com.br",
          permissoes: ["THC"],
          status: "inativo",
          data_cadastro: "2024-01-08",
        },
      ];

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMedicos(mockMedicos);
    } catch (error) {
      setError("Erro ao carregar médicos");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissoesBadges = (permissoes: Medico["permissoes"]) => {
    const permissaoConfig = {
      THC: {
        color: "bg-purple-500",
        text: "THC",
        bgClass: "bg-purple-50 text-purple-700 border-purple-200",
      },
      CBD: {
        color: "bg-green-500",
        text: "CBD",
        bgClass: "bg-green-50 text-green-700 border-green-200",
      },
    };

    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {permissoes.map((permissao) => {
          const config = permissaoConfig[permissao];
          return (
            <span
              key={permissao}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bgClass}`}
            >
              <span
                className={`w-2 h-2 ${config.color} rounded-full mr-1`}
              ></span>
              {config.text}
            </span>
          );
        })}
      </div>
    );
  };

  const handleEdit = (medico: Medico) => {
    // Aqui seria redirecionado para página de edição do médico
    console.log("Editar médico:", medico);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este médico?")) return;

    try {
      // Aqui seria a chamada para a API real
      setMedicos(medicos.filter((m) => m.id !== id));
    } catch (error) {
      setError("Erro ao excluir médico");
      console.error("Erro:", error);
    }
  };

  const filteredMedicos = medicos.filter(
    (medico) =>
      String(medico.nome).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(medico.crm).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(medico.especialidade)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(medico.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "nome" as keyof Medico,
      header: "Nome",
      render: (medico: Medico) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(medico.nome)}
        </span>
      ),
    },
    {
      key: "crm" as keyof Medico,
      header: "CRM",
      render: (medico: Medico) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(medico.crm)}
        </span>
      ),
    },
    {
      key: "especialidade" as keyof Medico,
      header: "Especialidade",
      render: (medico: Medico) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(medico.especialidade)}
        </span>
      ),
    },
    {
      key: "permissoes" as keyof Medico,
      header: "Permissões",
      render: (medico: Medico) =>
        getPermissoesBadges(medico.permissoes as ("THC" | "CBD")[]),
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
      onClick: (medico: Medico) => handleDelete(medico.id),
      variant: "danger" as const,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Gerencie os médicos cadastrados no sistema
            </p>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar por nome, CRM, especialidade ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={() => {
                /* Funcionalidade para cadastrar novo médico */
              }}
              icon={<FaPlus />}
              variant="primary"
              size="md"
              className="whitespace-nowrap"
            >
              Cadastrar Médico
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
                  <FaUserMd className="w-4 h-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {medicos.length}
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
                    {medicos.filter((m) => m.status === "ativo").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="w-4 h-4 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Com THC</p>
                  <p className="text-xl font-bold text-gray-900">
                    {medicos.filter((m) => m.permissoes.includes("THC")).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FaGraduationCap className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Com CBD</p>
                  <p className="text-xl font-bold text-gray-900">
                    {medicos.filter((m) => m.permissoes.includes("CBD")).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Table
          data={filteredMedicos}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum médico encontrado"
          mobileCardRender={(medico: Medico) => (
            <div className="bg-white rounded-lg p-4 shadow-sm border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaUserMd className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-sm font-medium">
                      {String(medico.nome)}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {String(medico.crm)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {getPermissoesBadges(medico.permissoes as ("THC" | "CBD")[])}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Especialidade:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(medico.especialidade)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Telefone:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(medico.telefone)}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 text-xs font-medium">
                    Email:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(medico.email)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => action.onClick(medico)}
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
