"use client";

import MainLayout from "@/components/MainLayout";

export default function MedicamentosPaciente() {
  return (
    <MainLayout>
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">
          Meus Medicamentos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Nenhum medicamento encontrado
                </h2>
                <p className="text-gray-500 text-sm">Status: -</p>
              </div>
            </div>
            <p className="text-gray-600">
              Você ainda não possui medicamentos cadastrados.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
