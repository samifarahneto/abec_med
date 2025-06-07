"use client";

import { useSession } from "next-auth/react";
import MainLayout from "@/components/MainLayout";

export default function DashboardPaciente() {
  const { data: session } = useSession();

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#16829E]">
          Bem-vindo, {session?.user?.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Cards de resumo */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Próximas Consultas
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Nenhuma consulta agendada
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Receitas Pendentes
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Nenhuma receita pendente
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md md:col-span-2 xl:col-span-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Medicamentos
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Nenhum medicamento em uso
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
