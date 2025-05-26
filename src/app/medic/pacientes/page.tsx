"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch, FaUser, FaEye, FaEdit } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";

interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  ultimaConsulta: string;
  status: "ativo" | "inativo";
}

export default function PacientesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "doctor") {
      router.push("/");
    } else {
      carregarPacientes();
    }
  }, [session, status, router]);

  const carregarPacientes = () => {
    // Simulando dados de pacientes
    setPacientes([
      {
        id: "1",
        nome: "Maria Silva",
        email: "maria@email.com",
        telefone: "(11) 99999-9999",
        ultimaConsulta: "15/03/2024",
        status: "ativo",
      },
      {
        id: "2",
        nome: "João Santos",
        email: "joao@email.com",
        telefone: "(11) 98888-8888",
        ultimaConsulta: "10/03/2024",
        status: "ativo",
      },
      {
        id: "3",
        nome: "Ana Oliveira",
        email: "ana@email.com",
        telefone: "(11) 97777-7777",
        ultimaConsulta: "05/03/2024",
        status: "inativo",
      },
    ]);
  };

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      paciente.email.toLowerCase().includes(busca.toLowerCase())
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
          <h1 className="text-2xl font-bold text-[#16829E]">Pacientes</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pacientes..."
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
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Consulta
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
                {pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="h-5 w-5 text-[#16829E] mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {paciente.nome}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.telefone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.ultimaConsulta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          paciente.status === "ativo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {paciente.status === "ativo" ? "Ativo" : "Inativo"}
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
                        <button
                          className="text-[#16829E] hover:text-[#126a80]"
                          title="Editar"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
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
