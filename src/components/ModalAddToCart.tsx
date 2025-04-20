"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaMinus,
  FaPlus,
  FaTimes,
  FaLeaf,
  FaFlask,
  FaSeedling,
} from "react-icons/fa";
import { useCarrinho } from "@/contexts/CarrinhoContext";

interface ModalAddToCartProps {
  isOpen: boolean;
  onCloseAction: () => void;
  produto: {
    id: number;
    nome: string;
    preco: number;
    foto: string;
    tipo: string;
    strain_type?: string;
    canabinoide: string;
    descricao: string;
    tags: string[];
  };
}

export default function ModalAddToCart({
  isOpen,
  onCloseAction,
  produto,
}: ModalAddToCartProps) {
  const [quantidade, setQuantidade] = useState(5);
  const { adicionarProduto } = useCarrinho();

  if (!isOpen) return null;

  const handleAdicionarAoCarrinho = () => {
    adicionarProduto({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade,
      foto: produto.foto,
    });
    onCloseAction();
  };

  const incrementarQuantidade = () => {
    setQuantidade((prev) => prev + 5);
  };

  const decrementarQuantidade = () => {
    if (quantidade > 5) {
      setQuantidade((prev) => prev - 5);
    }
  };

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 5 && value % 5 === 0) {
      setQuantidade(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-8 flex flex-col h-full">
          {/* Cabeçalho do Modal */}
          <div className="relative mb-8">
            <button
              onClick={onCloseAction}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {produto.nome}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(42 avaliações)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 flex-1">
            {/* Coluna Esquerda */}
            <div>
              {/* Imagem do Produto */}
              <div className="bg-white rounded-xl p-4 sm:p-8 mb-6 border border-gray-100">
                <div className="relative w-full aspect-square">
                  {produto.foto ? (
                    <Image
                      src={produto.foto}
                      alt={produto.nome}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem foto</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição do Produto */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Sobre o Medicamento
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {produto.descricao}
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="flex flex-col">
              {/* Destaques do Produto */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Destaques do Medicamento
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#16829E]/5 to-[#16829E]/10 rounded-full border border-[#16829E]/10">
                    <FaFlask className="w-4 h-4 text-[#16829E]" />
                    <span className="text-sm font-medium text-[#16829E]">
                      {produto.canabinoide}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#16829E]/5 to-[#16829E]/10 rounded-full border border-[#16829E]/10">
                    <FaLeaf className="w-4 h-4 text-[#16829E]" />
                    <span className="text-sm font-medium text-[#16829E]">
                      {produto.tipo}
                    </span>
                  </div>
                  {produto.strain_type && (
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#16829E]/5 to-[#16829E]/10 rounded-full border border-[#16829E]/10">
                      <FaSeedling className="w-4 h-4 text-[#16829E]" />
                      <span className="text-sm font-medium text-[#16829E]">
                        {produto.strain_type}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Características do Medicamento */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mt-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Características do Medicamento
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Tags Positivas */}
                  <div>
                    <h4 className="text-base font-medium text-[#16829E] mb-3">
                      Bom para:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {produto.tags &&
                        produto.tags
                          .filter((tag) => !tag.startsWith("negativo:"))
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-[#16829E]/10 text-[#16829E] text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                    </div>
                  </div>

                  {/* Tags Negativas */}
                  <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                    <h4 className="text-base font-medium text-red-500 mb-3">
                      Efeito Colateral:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {produto.tags &&
                        produto.tags
                          .filter((tag) => tag.startsWith("negativo:"))
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium"
                            >
                              {tag.replace("negativo:", "")}
                            </span>
                          ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preço e Quantidade */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mt-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <span className="text-2xl sm:text-3xl font-bold text-[#16829E] text-center sm:text-left">
                    R$ {produto.preco.toFixed(2)}
                    <span className="text-base sm:text-lg text-gray-500 ml-2">
                      (g)
                    </span>
                  </span>
                  <div className="flex items-center justify-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
                    <button
                      onClick={decrementarQuantidade}
                      className="hover:bg-gray-100 p-2 rounded-full transition-colors text-[#16829E]"
                    >
                      <FaMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={quantidade}
                      onChange={handleQuantidadeChange}
                      className="w-12 sm:w-16 text-center font-semibold text-base sm:text-lg text-black focus:outline-none"
                    />
                    <button
                      onClick={incrementarQuantidade}
                      className="hover:bg-gray-100 p-2 rounded-full transition-colors text-[#16829E]"
                    >
                      <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-[#16829E]">
                    Total
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#16829E]">
                    R$ {(produto.preco * quantidade).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleAdicionarAoCarrinho}
                  className="w-full bg-[#16829E] text-white py-3 sm:py-4 rounded-xl hover:bg-[#126a7e] transition-colors font-medium text-base sm:text-lg flex items-center justify-center gap-3"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
