"use client";

import { useSession } from "next-auth/react";
import MainLayout from "@/components/MainLayout";

export default function DashboardPaciente() {
  const { data: session } = useSession();

  return (
    <MainLayout>
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">
          Bem-vindo, {session?.user?.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cards de resumo */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Próximas Consultas
            </h2>
            <p className="text-gray-500">Nenhuma consulta agendada</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Receitas Pendentes
            </h2>
            <p className="text-gray-500">Nenhuma receita pendente</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Medicamentos
            </h2>
            <p className="text-gray-500">Nenhum medicamento em uso</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
