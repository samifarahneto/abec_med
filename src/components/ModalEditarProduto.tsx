"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FormInput, FormSelect, FormTextarea } from "@/components/ui";

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

interface ModalEditarProdutoProps {
  produto: Produto | null;
  onCloseAction: () => void;
  onSaveAction: (produto: Produto) => void;
}

export default function ModalEditarProduto({
  produto,
  onCloseAction,
  onSaveAction,
}: ModalEditarProdutoProps) {
  const [formData, setFormData] = useState<Produto | null>(null);

  useEffect(() => {
    if (produto) {
      setFormData(produto);
    }
  }, [produto]);

  if (!produto || !formData) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]:
          name === "preco" || name === "quantidade" ? Number(value) : value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSaveAction(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#16829E]">Editar Produto</h2>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <FormSelect
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="Flor">Flor</option>
              <option value="Óleo">Óleo</option>
              <option value="Concentrado">Concentrado</option>
              <option value="Comestíveis">Comestíveis</option>
            </FormSelect>

            <FormInput
              label="Strain Type"
              name="strain_type"
              value={formData.strain_type || ""}
              onChange={handleChange}
            />

            <FormInput
              label="Canabinóide"
              name="canabinoide"
              value={formData.canabinoide}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Quantidade"
              type="number"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              min="0"
              required
            />

            <FormInput
              label="Preço"
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <FormTextarea
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={4}
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#16829E] rounded-md hover:bg-[#126a7e]"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
