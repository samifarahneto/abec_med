"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { FaSearch } from "react-icons/fa";

interface Medicamento {
  id: number;
  nome: string;
  fabricante: string;
  categoria: string;
  concentracao: string;
  preco: number;
  quantidadeEstoque: number;
}

export default function MedicamentosPaciente() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      // Simulando dados para funcionar sem backend por enquanto
      const mockData: Medicamento[] = [
        {
          id: 1,
          nome: "Cannabis Oil 20ml",
          fabricante: "Farmacorp",
          categoria: "óleo",
          concentracao: "10mg/ml THC",
          preco: 150.0,
          quantidadeEstoque: 25,
        },
        {
          id: 2,
          nome: "CBD Cápsula",
          fabricante: "MedCannabis",
          categoria: "cápsula",
          concentracao: "25mg CBD",
          preco: 89.9,
          quantidadeEstoque: 0,
        },
        {
          id: 3,
          nome: "Extrato Premium",
          fabricante: "PharmaCBD",
          categoria: "extract",
          concentracao: "50mg/ml CBD",
          preco: 280.0,
          quantidadeEstoque: 12,
        },
      ];
      setMedicamentos(mockData);
    } catch {
      setError("Erro ao carregar medicamentos");
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicamentos = useMemo(() => {
    return medicamentos.filter((medicamento) => {
      const matchesSearch =
        medicamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicamento.fabricante.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filterCategory || medicamento.categoria === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [medicamentos, searchTerm, filterCategory]);

  const adicionarAoCarrinho = (medicamento: Medicamento) => {
    // Implementar funcionalidade do carrinho aqui
    console.log("Adicionando ao carrinho:", medicamento);
    alert(`${medicamento.nome} adicionado ao carrinho!`);
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#16829E] text-center sm:text-left">
            Catálogo de Medicamentos
          </h1>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar medicamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16829E] focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16829E] focus:border-transparent bg-white"
            >
              <option value="">Todas as categorias</option>
              <option value="óleo">Óleo</option>
              <option value="cápsula">Cápsula</option>
              <option value="extract">Extrato</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-600 text-sm sm:text-base">
              Carregando medicamentos...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        ) : filteredMedicamentos.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-600 text-sm sm:text-base">
              {searchTerm || filterCategory
                ? "Nenhum medicamento encontrado com os filtros aplicados"
                : "Nenhum medicamento disponível"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicamento
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concentração
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estoque
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMedicamentos.map((medicamento) => (
                      <tr key={medicamento.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {medicamento.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {medicamento.fabricante}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                            {medicamento.categoria}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicamento.concentracao}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {medicamento.preco.toFixed(2).replace(".", ",")}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicamento.quantidadeEstoque} unidades
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => adicionarAoCarrinho(medicamento)}
                            disabled={medicamento.quantidadeEstoque === 0}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              medicamento.quantidadeEstoque === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-[#16829E] text-white hover:bg-[#126a7e]"
                            }`}
                          >
                            {medicamento.quantidadeEstoque === 0
                              ? "Sem estoque"
                              : "Adicionar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {filteredMedicamentos.map((medicamento) => (
                <div
                  key={medicamento.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {medicamento.nome}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {medicamento.fabricante}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-[#16829E] ml-3">
                      R$ {medicamento.preco.toFixed(2).replace(".", ",")}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Categoria</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize mt-1">
                        {medicamento.categoria}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Concentração</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {medicamento.concentracao}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Estoque</p>
                      <p
                        className={`text-sm font-medium ${
                          medicamento.quantidadeEstoque === 0
                            ? "text-red-600"
                            : medicamento.quantidadeEstoque <= 5
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {medicamento.quantidadeEstoque === 0
                          ? "Sem estoque"
                          : `${medicamento.quantidadeEstoque} unidades`}
                      </p>
                    </div>

                    <button
                      onClick={() => adicionarAoCarrinho(medicamento)}
                      disabled={medicamento.quantidadeEstoque === 0}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        medicamento.quantidadeEstoque === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#16829E] text-white hover:bg-[#126a7e]"
                      }`}
                    >
                      {medicamento.quantidadeEstoque === 0
                        ? "Sem estoque"
                        : "Adicionar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
