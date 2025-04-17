"use client";

import ProfileLayout from "@/components/ProfileLayout";
import PatientHeader from "@/components/PatientHeader";

export default function PacientePage() {
  return (
    <div>
      <PatientHeader />
      <ProfileLayout>
        <div className="px-6">
          <h1 className="text-2xl font-bold text-[#16829E] mb-6">
            Área do Paciente
          </h1>
          {/* Conteúdo da página principal */}
        </div>
      </ProfileLayout>
    </div>
  );
}
