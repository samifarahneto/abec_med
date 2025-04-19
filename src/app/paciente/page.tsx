"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

export default function PacientePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/paciente/dashboard");
  }, [router]);

  return (
    <MainLayout>
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">
          Redirecionando para o Dashboard...
        </h1>
      </div>
    </MainLayout>
  );
}
