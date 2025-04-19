"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  foto: string;
  quantidade: number;
  canabinoide: string;
  tipo: string;
  strain_type?: string;
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onCloseAction,
}: ProductModalProps) {
  const [quantidade, setQuantidade] = useState(1);

  if (!isOpen) return null;

  const handleIncrement = () => {
    if (quantidade < product.quantidade) {
      setQuantidade(quantidade + 1);
    }
  };

  const handleDecrement = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleAddToCart = () => {
    // Aqui você implementaria a lógica para adicionar ao carrinho
    console.log(
      `Adicionando ${quantidade} unidades de ${product.nome} ao carrinho`
    );
    onCloseAction();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onCloseAction}
        />
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:ring-offset-2"
              onClick={onCloseAction}
            >
              <span className="sr-only">Fechar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative h-96">
                    {product.foto &&
                    product.foto !== "/produtos/sem-foto.jpg" ? (
                      <Image
                        src={product.foto}
                        alt={product.nome}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-400">Sem foto</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-bold text-black mb-2"
                    >
                      {product.nome}
                    </Dialog.Title>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {product.canabinoide}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {product.tipo}
                      </span>
                      {product.strain_type && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {product.strain_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-2">
                        Descrição
                      </h4>
                      <p className="text-black">{product.descricao}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-0 flex items-center justify-between">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-black mb-1">Preço</h4>
              <p className="text-2xl font-bold text-[#16829E]">
                R$ {product.preco.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-black mb-2 text-center">
                Selecione a quantidade
              </h4>
              <div className="flex items-center justify-between max-w-[200px] mx-auto">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={quantidade <= 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="text-xl font-semibold text-black px-4">
                  {quantidade}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={quantidade >= product.quantidade}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-[#16829E] px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#126a7e]"
                onClick={handleAddToCart}
              >
                Adicionar ao Carrinho ({quantidade})
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-white px-4 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={onCloseAction}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
