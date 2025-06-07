"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FaUsers,
  FaShoppingCart,
  FaPills,
  FaChartLine,
  FaCalendarCheck,
  FaFileMedical,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import MainLayout from "@/components/MainLayout";

interface DashboardStats {
  totalPacientes: number;
  pedidosPendentes: number;
  medicamentosDisponiveis: number;
  consultasHoje: number;
  receitasPendentes: number;
  medicamentosBaixoEstoque: number;
  pedidosAprovados: number;
  consultasSemana: number;
}

export default function MedicDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalPacientes: 0,
    pedidosPendentes: 0,
    medicamentosDisponiveis: 0,
    consultasHoje: 0,
    receitasPendentes: 0,
    medicamentosBaixoEstoque: 0,
    pedidosAprovados: 0,
    consultasSemana: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "doctor") {
      router.push("/");
    } else {
      // Simulando carregamento de dados
      setStats({
        totalPacientes: 45,
        pedidosPendentes: 12,
        medicamentosDisponiveis: 28,
        consultasHoje: 5,
        receitasPendentes: 8,
        medicamentosBaixoEstoque: 3,
        pedidosAprovados: 15,
        consultasSemana: 18,
      });
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16829E]"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#16829E]">
          Bem-vindo, {session?.user?.name}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Card de Pacientes */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                <FaUsers className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Total de Pacientes
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.totalPacientes}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Pedidos Pendentes */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
                <FaShoppingCart className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Pedidos Pendentes
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.pedidosPendentes}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Medicamentos */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                <FaPills className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Medicamentos Disponíveis
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.medicamentosDisponiveis}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Consultas Hoje */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                <FaCalendarCheck className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Consultas Hoje
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.consultasHoje}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Receitas Pendentes */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0">
                <FaFileMedical className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Receitas Pendentes
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.receitasPendentes}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Medicamentos Baixo Estoque */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                <FaExclamationTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Baixo Estoque
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.medicamentosBaixoEstoque}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Pedidos Aprovados */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
                <FaCheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Pedidos Aprovados
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.pedidosAprovados}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Consultas da Semana */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-cyan-100 text-cyan-600 flex-shrink-0">
                <FaChartLine className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Consultas na Semana
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.consultasSemana}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Atividades Recentes */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Atividades Recentes
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Novo pedido de medicamento
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Paciente: Maria Silva
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">
                Há 2 horas
              </span>
            </div>
            <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Consulta agendada
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Paciente: João Santos
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">
                Há 3 horas
              </span>
            </div>
            <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Pedido aprovado
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Paciente: Ana Oliveira
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">
                Há 5 horas
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
