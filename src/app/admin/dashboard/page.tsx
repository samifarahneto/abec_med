"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaUserMd, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";

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
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#16829E]">
          Dashboard Administrativo
        </h1>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Total de Pacientes */}
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

          {/* Total de Médicos */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                <FaUserMd className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Total de Médicos
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.totalMedicos}
                </p>
              </div>
            </div>
          </div>

          {/* Consultas Hoje */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
                <FaCalendarAlt className="w-4 h-4 sm:w-6 sm:h-6" />
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

          {/* Taxa de Crescimento */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                <FaChartLine className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Taxa de Crescimento
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.taxaCrescimento}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Gráfico de Consultas */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Consultas por Mês
            </h2>
            <div className="h-48 sm:h-56 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm sm:text-base text-center px-4">
                Gráfico de consultas será implementado aqui
              </p>
            </div>
          </div>

          {/* Tabela de Últimos Usuários */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Últimos Usuários Registrados
            </h2>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="min-w-full inline-block align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600">
                        Nome
                      </th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hidden sm:table-cell">
                        Email
                      </th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600">
                        Tipo
                      </th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hidden md:table-cell">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                        Exemplo Usuário
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                        exemplo@email.com
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Paciente
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                        26/05/2025
                      </td>
                    </tr>
                    {/* Adicione mais linhas ou mapeie dados aqui */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
