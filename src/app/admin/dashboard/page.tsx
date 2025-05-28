"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaUserMd, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import MainLayout from "@/components/MainLayout"; // Import MainLayout

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalMedicos: 0,
    consultasHoje: 0,
    taxaCrescimento: 0,
  });

  useEffect(() => {
    // Simulando carregamento de dados
    const carregarDados = async () => {
      // Aqui você faria a chamada à API
      setStats({
        totalPacientes: 150,
        totalMedicos: 25,
        consultasHoje: 30,
        taxaCrescimento: 15,
      });
    };

    carregarDados();
  }, []);

  return (
    // Wrap content with MainLayout
    <MainLayout>
      {/* Apply inner padding if needed, consistent with patient pages */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">
          Dashboard Administrativo
        </h1>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Pacientes */}
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

          {/* Total de Médicos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaUserMd className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Médicos
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalMedicos}
                </p>
              </div>
            </div>
          </div>

          {/* Consultas Hoje */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaCalendarAlt className="w-6 h-6" />
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

          {/* Taxa de Crescimento */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaChartLine className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Taxa de Crescimento
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.taxaCrescimento}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Consultas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Consultas por Mês
            </h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Gráfico de consultas será implementado aqui
              </p>
            </div>
          </div>

          {/* Tabela de Últimos Usuários */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Últimos Usuários Registrados
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example row - replace with actual data mapping */}
                  <tr className="border-b">
                    <td className="py-3 px-4">Exemplo Usuário</td>
                    <td className="py-3 px-4">exemplo@email.com</td>
                    <td className="py-3 px-4">Paciente</td>
                    <td className="py-3 px-4">26/05/2025</td>
                  </tr>
                  {/* Add more rows or map data here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

