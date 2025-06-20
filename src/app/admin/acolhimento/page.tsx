"use client";

import { useState, useEffect } from "react";
import {
  FaUserCheck,
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import { Input, Table, Button } from "@/components/ui";

interface Acolhimento extends Record<string, unknown> {
  id: string;
  paciente_id: string;
  paciente_nome: string;
  paciente_cpf: string;
  medico_nome: string;
  tipo_consulta: string;
  hora_chegada: string;
  hora_agendada: string;
  prioridade: "baixa" | "media" | "alta" | "urgente";
  status: "aguardando" | "triagem" | "em_atendimento" | "atendido" | "faltou";
  permissoes: ("THC" | "CBD")[];
  observacoes: string;
  data_atendimento: string;
}

export default function AcolhimentoPage() {
  const [atendimentos, setAtendimentos] = useState<Acolhimento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAtendimentos();
  }, []);

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
          medico_nome: "Dr. João Carvalho",
          tipo_consulta: "Consulta de Rotina",
          hora_chegada: "08:15",
          hora_agendada: "08:30",
          prioridade: "media",
          status: "aguardando",
          permissoes: ["THC", "CBD"],
          observacoes: "Primeira consulta, paciente nervosa",
          data_atendimento: "2024-01-15",
        },
        {
          id: "2",
          paciente_id: "PAC002",
          paciente_nome: "João Pedro Oliveira",
          paciente_cpf: "987.654.321-00",
          medico_nome: "Dra. Ana Santos",
          tipo_consulta: "Retorno",
          hora_chegada: "09:00",
          hora_agendada: "09:00",
          prioridade: "baixa",
          status: "em_atendimento",
          permissoes: ["CBD"],
          observacoes: "Paciente pontual, retorno de hipertensão",
          data_atendimento: "2024-01-15",
        },
        {
          id: "3",
          paciente_id: "PAC003",
          paciente_nome: "Ana Carolina Ferreira",
          paciente_cpf: "456.789.123-00",
          medico_nome: "Dr. Carlos Silva",
          tipo_consulta: "Consulta Especializada",
          hora_chegada: "10:45",
          hora_agendada: "11:00",
          prioridade: "alta",
          status: "triagem",
          permissoes: ["THC"],
          observacoes: "Dor no peito, verificar sinais vitais",
          data_atendimento: "2024-01-15",
        },
        {
          id: "4",
          paciente_id: "PAC004",
          paciente_nome: "Roberto Lima Souza",
          paciente_cpf: "789.123.456-00",
          medico_nome: "Dra. Marina Costa",
          tipo_consulta: "Emergência",
          hora_chegada: "07:30",
          hora_agendada: "08:00",
          prioridade: "urgente",
          status: "atendido",
          permissoes: ["THC", "CBD"],
          observacoes: "Atendimento de urgência concluído",
          data_atendimento: "2024-01-15",
        },
      ];

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAtendimentos(mockAtendimentos);
    } catch (error) {
      setError("Erro ao carregar dados de acolhimento");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissoesBadges = (permissoes: Acolhimento["permissoes"]) => {
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

  const filteredAtendimentos = atendimentos.filter(
    (atendimento) =>
      String(atendimento.paciente_nome)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(atendimento.paciente_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(atendimento.paciente_cpf).includes(searchTerm) ||
      String(atendimento.medico_nome)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "paciente_nome" as keyof Acolhimento,
      header: "Paciente",
      render: (atendimento: Acolhimento) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(atendimento.paciente_nome)}
        </span>
      ),
    },
    {
      key: "medico_nome" as keyof Acolhimento,
      header: "Médico",
      render: (atendimento: Acolhimento) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(atendimento.medico_nome)}
        </span>
      ),
    },
    {
      key: "hora_agendada" as keyof Acolhimento,
      header: "Horário",
      render: (atendimento: Acolhimento) => (
        <span className="text-gray-900 text-sm font-medium">
          {String(atendimento.hora_agendada)}
        </span>
      ),
    },
    {
      key: "permissoes" as keyof Acolhimento,
      header: "Permissões",
      render: (atendimento: Acolhimento) =>
        getPermissoesBadges(atendimento.permissoes as ("THC" | "CBD")[]),
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
    } catch (error) {
      setError("Erro ao excluir agendamento");
      console.error("Erro:", error);
    }
  };

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
      onClick: (atendimento: Acolhimento) => handleDelete(atendimento.id),
      variant: "danger" as const,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Acolhimento</h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Gerencie o fluxo de atendimento e triagem de pacientes
            </p>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar por paciente, médico ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={() => {
                /* Funcionalidade para agendar novo atendimento */
              }}
              icon={<FaPlus />}
              variant="primary"
              size="md"
              className="whitespace-nowrap"
            >
              Cadastrar Colaborador
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
                  <FaClock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Aguardando
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      atendimentos.filter((a) => a.status === "aguardando")
                        .length
                    }
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
                  <p className="text-sm font-medium text-gray-600">Triagem</p>
                  <p className="text-xl font-bold text-gray-900">
                    {atendimentos.filter((a) => a.status === "triagem").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaUserCheck className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Em Atendimento
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      atendimentos.filter((a) => a.status === "em_atendimento")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Atendidos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {atendimentos.filter((a) => a.status === "atendido").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Table
          data={filteredAtendimentos}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum atendimento encontrado para hoje"
          mobileCardRender={(atendimento: Acolhimento) => (
            <div className="bg-white rounded-lg p-4 shadow-sm border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaUserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-sm font-medium">
                      {String(atendimento.paciente_nome)}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {getPermissoesBadges(
                    atendimento.permissoes as ("THC" | "CBD")[]
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Médico:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(atendimento.medico_nome)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Consulta:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(atendimento.tipo_consulta)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Agendado:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(atendimento.hora_agendada)}
                  </p>
                </div>
              </div>

              {atendimento.observacoes && (
                <div>
                  <span className="text-gray-500 text-xs font-medium">
                    Observações:
                  </span>
                  <p className="text-gray-900 text-sm font-medium">
                    {String(atendimento.observacoes)}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => action.onClick(atendimento)}
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
