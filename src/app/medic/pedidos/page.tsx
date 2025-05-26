"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch, FaUser, FaEye, FaTimes } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";

interface Pedido {
  id: string;
  paciente: {
    id: string;
    nome: string;
  };
  medicamentos: {
    nome: string;
    quantidade: number;
  }[];
  data: string;
  status: "pendente" | "aprovado" | "cancelado";
}

export default function PedidosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "doctor") {
      router.push("/");
    } else {
      carregarPedidos();
    }
  }, [session, status, router]);

  const carregarPedidos = () => {
    // Simulando dados de pedidos
    setPedidos([
      {
        id: "1",
        paciente: {
          id: "1",
          nome: "Maria Silva",
        },
        medicamentos: [
          {
            nome: "Paracetamol",
            quantidade: 2,
          },
          {
            nome: "Dipirona",
            quantidade: 1,
          },
        ],
        data: "15/03/2024",
        status: "pendente",
      },
      {
        id: "2",
        paciente: {
          id: "2",
          nome: "João Santos",
        },
        medicamentos: [
          {
            nome: "Amoxicilina",
            quantidade: 1,
          },
        ],
        data: "14/03/2024",
        status: "aprovado",
      },
      {
        id: "3",
        paciente: {
          id: "3",
          nome: "Ana Oliveira",
        },
        medicamentos: [
          {
            nome: "Ibuprofeno",
            quantidade: 1,
          },
        ],
        data: "13/03/2024",
        status: "cancelado",
      },
    ]);
  };

  const pedidosFiltrados = pedidos.filter(
    (pedido) =>
      pedido.paciente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      pedido.medicamentos.some((med) =>
        med.nome.toLowerCase().includes(busca.toLowerCase())
      )
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
          <h1 className="text-2xl font-bold text-[#16829E]">Pedidos</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pedidos..."
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
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicamentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="h-5 w-5 text-[#16829E] mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {pedido.paciente.nome}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {pedido.medicamentos.map((med, index) => (
                        <div key={index}>
                          {med.nome} ({med.quantidade})
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.data}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pedido.status === "aprovado"
                            ? "bg-green-100 text-green-800"
                            : pedido.status === "pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pedido.status === "aprovado"
                          ? "Aprovado"
                          : pedido.status === "pendente"
                          ? "Pendente"
                          : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="text-[#16829E] hover:text-[#126a80]"
                          title="Visualizar"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        {pedido.status === "pendente" && (
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Cancelar"
                          >
                            <FaTimes className="h-5 w-5" />
                          </button>
                        )}
                      </div>
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
