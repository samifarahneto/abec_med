import { useState, useEffect } from "react";
import Image from "next/image";
import { Produto } from "@/types/produto";

export default function ConcentradosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/api/produtos?tipo=Concentrado");
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Concentrados</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-[650px] flex flex-col group"
          >
            <div className="relative h-72">
              {produto.foto &&
              typeof produto.foto === "string" &&
              produto.foto.length > 0 ? (
                <Image
                  src={produto.foto}
                  alt={produto.nome}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sem foto</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="px-3 py-1 bg-[#16829E]/90 text-white rounded-full text-sm font-medium">
                  {produto.quantidade} disponíveis
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {produto.nome}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {produto.canabinoide}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {produto.tipo}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#16829E]">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <p className="text-sm text-gray-500">à vista</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {produto.descricao}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Informações Adicionais
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#16829E]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {new Date(produto.dataCadastro).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#16829E]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Em estoque
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-[#16829E] to-[#126a7e] text-white px-4 py-3 rounded-lg hover:from-[#126a7e] hover:to-[#16829E] transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.836 14 6.867 14H15a1 1 0 000-2H6.867l1.018-1.018a1 1 0 00.01-.042l1.358-5.43.893-.892C9.26 8.154 8.164 6 6.133 6H3a1 1 0 00-1 1v1z" />
                    <path d="M16 16a2 2 0 100-4 2 2 0 000 4z" />
                    <path d="M6 16a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
