"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";
import FormLayout from "@/components/ui/form-layout";

interface Produto {
  id: number;
  nome: string;
  tipo: string;
  strain_type?: string;
  canabinoide: string;
  quantidade: number | string;
  preco: number | string;
  foto: File | null;
  descricao: string;
  dataCadastro: string;
}

export default function NovoProduto() {
  const router = useRouter();
  const [produto, setProduto] = useState<Produto>({
    id: 0,
    nome: "",
    tipo: "Flor",
    strain_type: "Sativa",
    canabinoide: "THC",
    quantidade: 0,
    preco: 0,
    foto: null,
    descricao: "",
    dataCadastro: new Date().toISOString(),
  });

  const [erros, setErros] = useState<Partial<Produto>>({});
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: name === "quantidade" || name === "preco" ? Number(value) : value,
    }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduto((prev) => ({ ...prev, foto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validarFormulario = () => {
    const novosErros: Partial<Produto> = {};

    if (!produto.nome) novosErros.nome = "Nome é obrigatório";
    if (!produto.tipo) novosErros.tipo = "Tipo é obrigatório";
    if (!produto.canabinoide)
      novosErros.canabinoide = "Canabinoide é obrigatório";
    if (typeof produto.quantidade === "number" && produto.quantidade < 0)
      novosErros.quantidade = "Quantidade não pode ser negativa";
    if (typeof produto.preco === "number" && produto.preco < 0)
      novosErros.preco = "Preço não pode ser negativo";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validarFormulario()) {
      try {
        // Se houver uma foto, converte para base64
        let fotoBase64 = null;
        if (produto.foto instanceof File) {
          fotoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(produto.foto as File);
          });
        }

        // Cria o objeto de produto com a foto em base64
        const produtoParaEnviar = {
          ...produto,
          foto: fotoBase64 || "/produtos/sem-foto.jpg",
        };

        console.log("Enviando produto:", produtoParaEnviar); // Debug

        const response = await fetch("/api/produtos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(produtoParaEnviar),
        });

        const data = await response.json();
        console.log("Resposta da API:", data); // Debug

        if (data.success) {
          router.push("/admin/estoque");
        } else {
          alert("Erro ao salvar o produto. Por favor, tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao salvar o produto:", error);
        alert("Erro ao salvar o produto. Por favor, tente novamente.");
      }
    }
  };

  return (
    <FormLayout
      title="Novo Produto"
      onBack={() => router.push("/admin/estoque")}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admin/estoque")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Produto *
          </label>
          <input
            type="text"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-gray-900 ${
              erros.nome ? "border-red-500" : ""
            }`}
            placeholder="Digite o nome do produto"
          />
          {erros.nome && (
            <p className="mt-1 text-sm text-red-500">{erros.nome}</p>
          )}
        </div>

        {/* Tipo de Produto */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Produto *
          </label>
          <select
            name="tipo"
            value={produto.tipo}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-gray-900 ${
              erros.tipo ? "border-red-500" : ""
            }`}
          >
            <option value="Flor">Flor</option>
            <option value="Óleo">Óleo</option>
            <option value="Concentrado">Concentrado</option>
            <option value="Comestíveis">Comestíveis</option>
          </select>
          {erros.tipo && (
            <p className="mt-1 text-sm text-red-500">{erros.tipo}</p>
          )}
        </div>

        {/* Strain Type - Apenas para Flores */}
        {produto.tipo === "Flor" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Strain *
            </label>
            <select
              name="strain_type"
              value={produto.strain_type}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-gray-900 ${
                erros.strain_type ? "border-red-500" : ""
              }`}
            >
              <option value="Sativa">Sativa</option>
              <option value="Indica">Indica</option>
              <option value="Híbrida">Híbrida</option>
            </select>
            {erros.strain_type && (
              <p className="mt-1 text-sm text-red-500">{erros.strain_type}</p>
            )}
          </div>
        )}

        {/* Canabinóide */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Canabinóide *
          </label>
          <select
            name="canabinoide"
            value={produto.canabinoide}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-gray-900 ${
              erros.canabinoide ? "border-red-500" : ""
            }`}
          >
            <option value="THC">THC</option>
            <option value="CBD">CBD</option>
            <option value="CBG">CBG</option>
            <option value="CBN">CBN</option>
          </select>
          {erros.canabinoide && (
            <p className="mt-1 text-sm text-red-500">{erros.canabinoide}</p>
          )}
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantidade *
          </label>
          <input
            type="number"
            name="quantidade"
            value={produto.quantidade}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-gray-900 ${
              erros.quantidade ? "border-red-500" : ""
            }`}
            placeholder="Digite a quantidade"
          />
          {erros.quantidade && (
            <p className="mt-1 text-sm text-red-500">{erros.quantidade}</p>
          )}
        </div>

        {/* Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preço *
          </label>
          <input
            type="number"
            name="preco"
            value={produto.preco}
            onChange={handleChange}
            step="0.01"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-gray-900 ${
              erros.preco ? "border-red-500" : ""
            }`}
            placeholder="Digite o preço"
          />
          {erros.preco && (
            <p className="mt-1 text-sm text-red-500">{erros.preco}</p>
          )}
        </div>

        {/* Foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Foto do Produto
          </label>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
                id="foto"
              />
              <label
                htmlFor="foto"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600"
              >
                <FaUpload className="w-5 h-5" />
                Clique para selecionar uma foto do produto
              </label>
            </div>
            {previewFoto && (
              <div className="w-24 h-24 border rounded-lg overflow-hidden relative">
                <Image
                  src={previewFoto}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-gray-900"
            placeholder="Descreva as características do produto..."
          />
        </div>
      </div>
    </FormLayout>
  );
}
