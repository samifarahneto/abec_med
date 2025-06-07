"use client";

import MainLayout from "@/components/MainLayout";

export default function PacientePage() {
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#16829E] text-center sm:text-left">
          Dashboard do Paciente
        </h1>
        {/* Conteúdo da página principal */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600">
            Bem-vindo à sua área pessoal. Use o menu lateral para navegar pelas
            funcionalidades disponíveis.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
