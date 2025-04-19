"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";

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
  strain_type?: string;
}

export default function FlowersPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<number[]>([]);

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
      <div className="px-6">
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">Flores</h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando produtos...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum produto disponível</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-[600px] flex flex-col group"
              >
                <div className="relative h-72">
                  {produto.foto && produto.foto !== "/produtos/sem-foto.jpg" ? (
                    <Image
                      src={produto.foto}
                      alt={produto.nome}
                      fill
                      className="object-cover transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem foto</span>
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorito(produto.id)}
                    className={`absolute top-2 left-2 p-2.5 rounded-full transition-all duration-300 ${
                      favoritos.includes(produto.id)
                        ? "bg-[#16829E]/10 shadow-lg"
                        : "bg-white/90 hover:bg-white shadow-md"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 transition-all duration-300 ${
                        favoritos.includes(produto.id)
                          ? "text-[#16829E] fill-[#16829E] scale-110"
                          : "text-[#16829E]/70 hover:text-[#16829E] hover:scale-110"
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-[#16829E]/90 text-white rounded-full text-sm font-medium">
                      {produto.strain_type || "Sem tipo"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {produto.nome}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {produto.canabinoide}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {produto.tipo}
                      </span>
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

                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-[#16829E]">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        <p className="text-sm text-gray-500">à vista</p>
                      </div>
                      <button className="bg-gradient-to-r from-[#16829E] to-[#126a7e] text-white px-4 py-2 rounded-lg hover:from-[#126a7e] hover:to-[#16829E] transition-all duration-300 flex items-center justify-center gap-2 font-medium">
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
                        Adicionar
                      </button>
                    </div>
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
