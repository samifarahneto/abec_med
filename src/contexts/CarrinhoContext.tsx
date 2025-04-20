"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  foto: string;
}

interface CarrinhoContextType {
  produtos: Produto[];
  quantidadeProdutos: number;
  adicionarProduto: (produto: Produto) => void;
  removerProduto: (id: number) => void;
  atualizarQuantidade: (id: number, quantidade: number) => void;
  limparCarrinho: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(
  undefined
);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const adicionarProduto = (produto: Produto) => {
    setProdutos((prev) => {
      const produtoExistente = prev.find((p) => p.id === produto.id);
      if (produtoExistente) {
        return prev.map((p) =>
          p.id === produto.id
            ? { ...p, quantidade: p.quantidade + produto.quantidade }
            : p
        );
      }
      return [...prev, produto];
    });
  };

  const removerProduto = (id: number) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const atualizarQuantidade = (id: number, quantidade: number) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantidade } : p))
    );
  };

  const limparCarrinho = () => {
    setProdutos([]);
  };

  const quantidadeProdutos = produtos.length;

  return (
    <CarrinhoContext.Provider
      value={{
        produtos,
        quantidadeProdutos,
        adicionarProduto,
        removerProduto,
        atualizarQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  }
  return context;
}
