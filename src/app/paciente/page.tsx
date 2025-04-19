"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import { useSession } from "next-auth/react";

export default function PacientePage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.replace("/paciente/dashboard");
    }
  }, [router, session]);

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
