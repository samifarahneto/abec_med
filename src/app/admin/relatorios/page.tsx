"use client";

import { useState } from "react";
import {
  FaDownload,
  FaFilter,
  FaChartLine,
  FaUserMd,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("consultas");
  const [periodo, setPeriodo] = useState("mes");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const handleGerarRelatorio = () => {
    // Implementar lógica de geração de relatório
    console.log("Gerando relatório:", {
      tipoRelatorio,
      periodo,
      dataInicio,
      dataFim,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#16829E]">Relatórios</h1>
        <button
          onClick={handleGerarRelatorio}
          className="bg-[#16829E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#126a7e] transition-colors"
        >
          <FaDownload className="w-4 h-4" />
          Gerar Relatório
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="w-5 h-5 text-[#16829E]" />
          <h2 className="text-xl font-semibold text-gray-800">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E]"
            >
              <option value="consultas">Consultas</option>
              <option value="pacientes">Pacientes</option>
              <option value="medicos">Médicos</option>
              <option value="financeiro">Financeiro</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Período</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E]"
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
          {periodo === "personalizado" && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E]"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E]"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Visualização de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Consultas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="w-5 h-5 text-[#16829E]" />
            <h3 className="text-lg font-semibold text-gray-800">Consultas</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Total: 150</p>
            <p className="text-gray-600">Confirmadas: 120</p>
            <p className="text-gray-600">Canceladas: 30</p>
          </div>
        </div>

        {/* Card de Médicos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaUserMd className="w-5 h-5 text-[#16829E]" />
            <h3 className="text-lg font-semibold text-gray-800">Médicos</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Total: 25</p>
            <p className="text-gray-600">Ativos: 20</p>
            <p className="text-gray-600">Inativos: 5</p>
          </div>
        </div>

        {/* Card de Desempenho */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="w-5 h-5 text-[#16829E]" />
            <h3 className="text-lg font-semibold text-gray-800">Desempenho</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Taxa de Ocupação: 85%</p>
            <p className="text-gray-600">Média de Consultas/Dia: 15</p>
            <p className="text-gray-600">Satisfação: 4.8/5</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="w-5 h-5 text-[#16829E]" />
            <h2 className="text-xl font-semibold text-gray-800">Gráficos</h2>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico será exibido aqui</p>
          </div>
        </div>
      </div>
    </div>
  );
}
