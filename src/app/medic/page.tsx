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
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">
          Bem-vindo, {session?.user?.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card de Pacientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUsers className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Pacientes
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalPacientes}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Pedidos Pendentes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaShoppingCart className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pedidos Pendentes
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pedidosPendentes}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Medicamentos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaPills className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Medicamentos Disponíveis
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.medicamentosDisponiveis}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Consultas Hoje */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaCalendarCheck className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Consultas Hoje
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.consultasHoje}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Receitas Pendentes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <FaFileMedical className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Receitas Pendentes
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.receitasPendentes}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Medicamentos Baixo Estoque */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FaExclamationTriangle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Baixo Estoque
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.medicamentosBaixoEstoque}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Pedidos Aprovados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                <FaCheckCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pedidos Aprovados
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pedidosAprovados}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Consultas da Semana */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
                <FaChartLine className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Consultas na Semana
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.consultasSemana}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Atividades Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Atividades Recentes
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Novo pedido de medicamento
                </p>
                <p className="text-sm text-gray-500">Paciente: Maria Silva</p>
              </div>
              <span className="text-sm text-gray-500">Há 2 horas</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Consulta agendada
                </p>
                <p className="text-sm text-gray-500">Paciente: João Santos</p>
              </div>
              <span className="text-sm text-gray-500">Há 3 horas</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Pedido aprovado
                </p>
                <p className="text-sm text-gray-500">Paciente: Ana Oliveira</p>
              </div>
              <span className="text-sm text-gray-500">Há 5 horas</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
