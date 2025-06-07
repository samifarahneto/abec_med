"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MainLayout from "@/components/MainLayout";

interface Produto {
  id: number;
  nome: string;
  tipo: string;
  canabinoide: string;
  quantidade: number;
  preco: number;
  foto: string;
  descricao: string;
  dataCadastro: string;
}

export default function ConcentradosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/api/produtos?tipo=Concentrado");
        const data = await response.json();
        if (data.success) {
          setProdutos(data.produtos);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#16829E]">
          Concentrados
        </h1>

        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#16829E] mx-auto"></div>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              Carregando produtos...
            </p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base">
              Nenhum produto disponível
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="relative h-48 sm:h-56 md:h-64">
                  {produto.foto &&
                  typeof produto.foto === "string" &&
                  produto.foto.length > 0 ? (
                    <Image
                      src={produto.foto}
                      alt={produto.nome}
                      fill
                      className="object-cover transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm sm:text-base">
                        Sem foto
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-[#16829E]/90 text-white rounded-full text-xs sm:text-sm font-medium">
                      {produto.quantidade} disponíveis
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
                  <div className="mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">
                      {produto.nome}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                        {produto.canabinoide}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                        {produto.tipo}
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#16829E]">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <p className="text-xs sm:text-sm text-gray-500">
                        à vista
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4 flex-grow">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Descrição
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                      {produto.descricao}
                    </p>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Informações
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4 text-[#16829E]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {new Date(produto.dataCadastro).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4 text-[#16829E]"
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

                  <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200">
                    <button className="w-full bg-gradient-to-r from-[#16829E] to-[#126a7e] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-[#126a7e] hover:to-[#16829E] transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
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
        )}
      </div>
    </MainLayout>
  );
}
