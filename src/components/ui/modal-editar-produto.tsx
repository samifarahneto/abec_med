"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FormLayout from "@/components/ui/form-layout";

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

interface ModalEditarProdutoProps {
  produto: Produto | null;
  onClose: () => void;
  onSave: (produto: Produto) => void;
}

export default function ModalEditarProduto({
  produto,
  onClose,
  onSave,
}: ModalEditarProdutoProps) {
  const [produtoEditado, setProdutoEditado] = useState<Produto | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  useEffect(() => {
    if (produto) {
      setProdutoEditado(produto);
      setPreviewFoto(produto.foto);
    }
  }, [produto]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!produtoEditado) return;

    const { name, value } = e.target;
    setProdutoEditado({
      ...produtoEditado,
      [name]: name === "preco" || name === "quantidade" ? Number(value) : value,
    });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!produtoEditado) return;

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result as string);
        setProdutoEditado({
          ...produtoEditado,
          foto: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (produtoEditado) {
      onSave(produtoEditado);
    }
  };

  if (!produtoEditado) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl rounded-lg">
        <div className="bg-white rounded-lg">
          <FormLayout
            title="Editar Produto"
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitText="Salvar Alterações"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={produtoEditado.nome}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={produtoEditado.tipo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                >
                  <option value="Flor">Flor</option>
                  <option value="Óleo">Óleo</option>
                  <option value="Concentrado">Concentrado</option>
                  <option value="Comestíveis">Comestíveis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Canabinóide
                </label>
                <select
                  name="canabinoide"
                  value={produtoEditado.canabinoide}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                >
                  <option value="THC">THC</option>
                  <option value="CBD">CBD</option>
                  <option value="THC+CBD">THC+CBD</option>
                  <option value="CBG">CBG</option>
                  <option value="CBN">CBN</option>
                  <option value="THCV">THCV</option>
                  <option value="CBDV">CBDV</option>
                  <option value="CBC">CBC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  name="quantidade"
                  value={produtoEditado.quantidade}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço
                </label>
                <input
                  type="number"
                  name="preco"
                  value={produtoEditado.preco}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="mt-1 block w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={produtoEditado.descricao}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                required
              />
            </div>

            {previewFoto && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview da Foto
                </label>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  {typeof previewFoto === "string" && previewFoto.length > 0 ? (
                    <Image
                      src={previewFoto}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sem foto</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </FormLayout>
        </div>
      </div>
    </div>
  );
}
