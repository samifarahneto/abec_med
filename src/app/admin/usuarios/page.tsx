"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ModalEditAdmin from "@/components/ModalEditAdmin";
import MainLayout from "@/components/MainLayout";

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export default function GerenciarUsuarios() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(
    null
  );

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setModalIsOpen(true);
  };

  const handleExcluir = async (usuario: Usuario) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o usuário ${usuario.name}?`
      )
    ) {
      try {
        const response = await fetch(`/api/users/${usuario.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir usuário");
        }

        await carregarUsuarios();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário. Tente novamente.");
      }
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioSelecionado) return;

    try {
      const response = await fetch(`/api/users/${usuarioSelecionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioSelecionado),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      setModalIsOpen(false);
      await carregarUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário. Tente novamente.");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "doctor":
        return "Médico";
      case "reception":
        return "Recepção";
      case "patient":
        return "Paciente";
      default:
        return "Usuário";
    }
  };

  const getStatusLabel = (active: boolean) => {
    return active ? "Ativo" : "Inativo";
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Mobile: H1 centralizado em container separado */}
        <div className="sm:hidden">
          <h1 className="text-xl font-bold text-[#16829E] text-center mb-4">
            Gerenciar Usuários
          </h1>
          <button
            onClick={() => router.push("/admin/usuarios/novo")}
            className="w-full bg-[#16829E] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#126a7e] transition-colors text-sm"
          >
            <FaPlus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>

        {/* Desktop: Layout flexível */}
        <div className="hidden sm:flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#16829E]">
            Gerenciar Usuários
          </h1>
          <button
            onClick={() => router.push("/admin/usuarios/novo")}
            className="bg-[#16829E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#126a7e] transition-colors text-base"
          >
            <FaPlus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="w-full px-4 py-2 sm:py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E] text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/5 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="w-1/5 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="w-1/5 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="w-1/5 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-1/5 px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 sm:px-6 py-4 text-center text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 sm:px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.name}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {usuario.email}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getRoleLabel(usuario.role)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usuario.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStatusLabel(usuario.active)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditar(usuario)}
                        className="text-[#16829E] hover:text-[#126a7e] mr-4"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(usuario)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
              Carregando...
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
              Nenhum usuário encontrado
            </div>
          ) : (
            filteredUsuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {usuario.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {usuario.email}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => handleEditar(usuario)}
                      className="p-2 text-[#16829E] hover:text-[#126a7e] hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExcluir(usuario)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getRoleLabel(usuario.role)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getStatusLabel(usuario.active)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginação */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Mostrando {filteredUsuarios.length} de {usuarios.length} usuários
          </div>
        </div>

        {/* Modal de Edição */}
        <ModalEditAdmin
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          title="Editar Usuário"
          onSave={handleSalvar}
        >
          {usuarioSelecionado && (
            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={usuarioSelecionado.name}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      name: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-sm sm:text-base text-black px-3 py-2 sm:py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={usuarioSelecionado.email}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      email: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-sm sm:text-base text-black px-3 py-2 sm:py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={usuarioSelecionado.role}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      role: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-sm sm:text-base text-black px-3 py-2 sm:py-3"
                >
                  <option value="admin">Administrador</option>
                  <option value="doctor">Médico</option>
                  <option value="reception">Recepção</option>
                  <option value="patient">Paciente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={usuarioSelecionado.active ? "true" : "false"}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      active: e.target.value === "true",
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-sm sm:text-base text-black px-3 py-2 sm:py-3"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </form>
          )}
        </ModalEditAdmin>
      </div>
    </MainLayout>
  );
}
