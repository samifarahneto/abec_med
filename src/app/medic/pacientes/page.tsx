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
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#16829E] text-center sm:text-left">
            Meus Pacientes
          </h1>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-transparent text-sm sm:text-base"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Consulta
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="h-5 w-5 text-[#16829E] mr-2 flex-shrink-0" />
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {paciente.nome}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.email}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.telefone}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {paciente.ultimaConsulta}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
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

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {pacientesFiltrados.map((paciente) => (
            <div
              key={paciente.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <FaUser className="h-5 w-5 text-[#16829E] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {paciente.nome}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {paciente.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ml-2 flex-shrink-0 ${
                    paciente.status === "ativo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {paciente.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm text-gray-900">{paciente.telefone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Última Consulta</p>
                  <p className="text-sm text-gray-900">
                    {paciente.ultimaConsulta}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200 rounded-md"
                  title="Visualizar"
                >
                  <FaEye className="mr-1" />
                  Visualizar
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200 rounded-md"
                  title="Editar"
                >
                  <FaEdit className="mr-1" />
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
