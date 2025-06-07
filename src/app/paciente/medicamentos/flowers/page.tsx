"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import ModalAddToCart from "@/components/ModalAddToCart";
import { FaHeart } from "react-icons/fa";

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
  tags: string[];
}

export default function FlowersPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );

  const toggleFavorito = (produtoId: number) => {
    setFavoritos((prev) => {
      const isFavorito = prev.includes(produtoId);
      if (isFavorito) {
        return prev.filter((id) => id !== produtoId);
      } else {
        return [...prev, produtoId];
      }
    });
  };

  const abrirModal = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/api/produtos?tipo=Flor");
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
        <h1 className="text-xl sm:text-2xl font-bold text-[#16829E] text-center sm:text-left">
          Flores
        </h1>

        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base">
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
                className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 sm:h-56 md:h-64">
                  {produto.foto && produto.foto !== "/produtos/sem-foto.jpg" ? (
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
                  <button
                    onClick={() => toggleFavorito(produto.id)}
                    className={`absolute top-2 left-2 p-2 rounded-full transition-all duration-300 ${
                      favoritos.includes(produto.id)
                        ? "bg-[#16829E]/10 shadow-lg"
                        : "bg-white/90 hover:bg-white shadow-md"
                    }`}
                  >
                    <FaHeart
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${
                        favoritos.includes(produto.id)
                          ? "text-[#16829E] fill-[#16829E] scale-110"
                          : "text-[#16829E]/70 hover:text-[#16829E] hover:scale-110"
                      }`}
                    />
                  </button>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-[#16829E]/90 text-white rounded-full text-xs sm:text-sm font-medium">
                      {produto.strain_type || "Sem tipo"}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
                  <div className="mb-3 sm:mb-4 text-center">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">
                      {produto.nome}
                    </h2>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                        {produto.canabinoide}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                        {produto.tipo}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4 flex-grow">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Descrição
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4">
                      {produto.descricao.length > 120
                        ? `${produto.descricao.substring(0, 120)}...`
                        : produto.descricao}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                      <div className="text-center sm:text-left">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#16829E]">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        <p className="text-xs sm:text-sm text-gray-500">
                          à vista
                        </p>
                      </div>
                      <button
                        onClick={() => abrirModal(produto)}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#16829E] to-[#126a7e] text-white px-3 sm:px-4 py-2 rounded-lg hover:from-[#126a7e] hover:to-[#16829E] transition-all duration-300 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                      >
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
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Adicionar ao Carrinho */}
        {produtoSelecionado && (
          <ModalAddToCart
            isOpen={isModalOpen}
            onCloseAction={() => setIsModalOpen(false)}
            produto={produtoSelecionado}
          />
        )}
      </div>
    </MainLayout>
  );
}
