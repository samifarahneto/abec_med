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
  tags: string[];
}

export default function OilsPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch("/api/produtos?tipo=Óleo");
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
        <h1 className="text-2xl font-bold text-[#16829E] mb-6">Óleos</h1>

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
                className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow h-[500px] flex flex-col"
              >
                <div className="relative h-64">
                  {produto.foto && produto.foto !== "/produtos/sem-foto.jpg" ? (
                    <Image
                      src={produto.foto}
                      alt={produto.nome}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem foto</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {produto.nome}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {produto.canabinoide}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {produto.quantidade} unidades
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">(4.5)</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {produto.descricao}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-[#16829E]">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                    <button className="bg-[#16829E] text-white px-4 py-2 rounded-lg hover:bg-[#126a7e] transition-colors">
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
