"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch, FaPills } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";

interface Medicamento {
  id: string;
  nome: string;
  tipo: string;
  concentracao: string;
  apresentacao: string;
  quantidade: number;
  status: "disponivel" | "baixo" | "indisponivel";
}

export default function MedicamentosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "doctor") {
      router.push("/");
    } else {
      carregarMedicamentos();
    }
  }, [session, status, router]);

  const carregarMedicamentos = () => {
    // Simulando dados de medicamentos
    setMedicamentos([
      {
        id: "1",
        nome: "Paracetamol",
        tipo: "Analgésico",
        concentracao: "500mg",
        apresentacao: "Comprimido",
        quantidade: 100,
        status: "disponivel",
      },
      {
        id: "2",
        nome: "Dipirona",
        tipo: "Analgésico",
        concentracao: "1g",
        apresentacao: "Comprimido",
        quantidade: 50,
        status: "baixo",
      },
      {
        id: "3",
        nome: "Amoxicilina",
        tipo: "Antibiótico",
        concentracao: "500mg",
        apresentacao: "Cápsula",
        quantidade: 0,
        status: "indisponivel",
      },
    ]);
  };

  const medicamentosFiltrados = medicamentos.filter(
    (med) =>
      med.nome.toLowerCase().includes(busca.toLowerCase()) ||
      med.tipo.toLowerCase().includes(busca.toLowerCase())
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16829E]"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#16829E]">Medicamentos</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar medicamentos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concentração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apresentação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicamentosFiltrados.map((medicamento) => (
                  <tr key={medicamento.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaPills className="h-5 w-5 text-[#16829E] mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {medicamento.nome}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicamento.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicamento.concentracao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicamento.apresentacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicamento.quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          medicamento.status === "disponivel"
                            ? "bg-green-100 text-green-800"
                            : medicamento.status === "baixo"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {medicamento.status === "disponivel"
                          ? "Disponível"
                          : medicamento.status === "baixo"
                          ? "Baixo Estoque"
                          : "Indisponível"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
