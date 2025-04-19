"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Produto {
  id: number;
  nome: string;
  tipo: string;
  strain_type?: string;
  canabinoide: string;
  quantidade: number;
  preco: number;
  foto: string;
  descricao: string;
  dataCadastro: string;
}

export default function Estoque() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoading(true);
        const tipos = ["Flor", "Óleo", "Concentrado", "Comestíveis"];
        const todosProdutos: Produto[] = [];

        for (const tipo of tipos) {
          const response = await fetch(`/api/produtos?tipo=${tipo}`);
          const data = await response.json();
          if (data.success) {
            todosProdutos.push(...data.produtos);
          }
        }

        setProdutos(todosProdutos);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const handleExcluirProduto = async (id: number, tipo: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await fetch(`/api/produtos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tipo }),
        });

        if (response.ok) {
          setProdutos((prevProdutos) =>
            prevProdutos.filter((produto) => produto.id !== id)
          );
          alert("Produto excluído com sucesso!");
        } else {
          const data = await response.json();
          alert(data.error || "Erro ao excluir o produto");
        }
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir o produto");
      }
    }
  };

  const renderTabela = (tipo: string) => {
    const produtosFiltrados = produtos.filter((p) => p.tipo === tipo);

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#16829E] mb-4">
          Estoque de {tipo}
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canabinóide
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum produto encontrado
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden">
                        {typeof produto.foto === "string" &&
                        produto.foto !== "/produtos/sem-foto.jpg" &&
                        produto.foto.trim() !== "" ? (
                          <Image
                            src={produto.foto}
                            alt={produto.nome}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              Sem foto
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {produto.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {produto.canabinoide}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {produto.quantidade}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        R$ {produto.preco.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(`/admin/estoque/editar/${produto.id}`)
                        }
                        className="text-[#16829E] hover:text-[#126a7e] mr-4"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleExcluirProduto(produto.id, produto.tipo)
                        }
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
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#16829E]">Gerenciar Estoque</h1>
        <button
          onClick={() => router.push("/admin/estoque/novo")}
          className="bg-[#16829E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#126a7e] transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : (
        <>
          {renderTabela("Flor")}
          {renderTabela("Óleo")}
          {renderTabela("Concentrado")}
          {renderTabela("Comestíveis")}
        </>
      )}
    </div>
  );
}
