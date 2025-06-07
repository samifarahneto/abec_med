"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload, FaTimes } from "react-icons/fa";
import Image from "next/image";
import FormLayout from "@/components/ui/form-layout";
import MainLayout from "@/components/MainLayout"; // Import MainLayout

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
  tags: string[];
}

export default function NovoProduto() {
  const router = useRouter();
  const [produto, setProduto] = useState<Produto>({
    id: 0,
    nome: "",
    tipo: "Flor",
    strain_type: "Sativa",
    canabinoide: "THC",
    quantidade: "", // Initialize as string for empty input
    preco: "", // Initialize as string for empty input
    foto: null,
    descricao: "",
    dataCadastro: new Date().toISOString(),
    tags: [],
  });

  const [erros, setErros] = useState<Partial<Produto>>({});
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    "Analgésico",
    "Anti-inflamatório",
    "Ansiolítico",
    "Antidepressivo",
    "Relaxante",
    "Energético",
    "Indutor de sono",
    "Estimulante de apetite",
    "Neuroprotetor",
    "Anticonvulsivante",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: value, // Keep value as string for controlled inputs
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
    const quantidadeNum = Number(produto.quantidade);
    const precoNum = Number(produto.preco);

    if (!produto.nome) novosErros.nome = "Nome é obrigatório";
    if (!produto.tipo) novosErros.tipo = "Tipo é obrigatório";
    if (!produto.canabinoide)
      novosErros.canabinoide = "Canabinóide é obrigatório";
    if (isNaN(quantidadeNum) || quantidadeNum < 0)
      novosErros.quantidade = "Quantidade inválida ou negativa";
    if (isNaN(precoNum) || precoNum < 0)
      novosErros.preco = "Preço inválido ou negativo";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validarFormulario()) {
      try {
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

        const produtoParaEnviar = {
          ...produto,
          quantidade: Number(produto.quantidade),
          preco: Number(produto.preco),
          foto: fotoBase64 || "/produtos/sem-foto.jpg",
          tags: [...selectedTags],
        };

        const response = await fetch("/api/produtos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(produtoParaEnviar),
        });

        const data = await response.json();

        if (data.success) {
          router.push("/admin/estoque");
        } else {
          alert(
            data.error ||
              "Erro ao salvar o produto. Por favor, tente novamente."
          );
        }
      } catch (error) {
        console.error("Erro ao salvar o produto:", error);
        alert("Erro ao salvar o produto. Por favor, tente novamente.");
      }
    }
  };

  return (
    // Wrap the entire page content with MainLayout
    <MainLayout>
      {/* FormLayout now sits inside MainLayout */}
      <FormLayout
        title="Novo Produto"
        onBack={() => router.push("/admin/estoque")}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/estoque")}
      >
        {/* Form fields remain inside FormLayout's children */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              name="nome"
              value={produto.nome}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-2 focus:ring-[#16829E] focus:ring-opacity-50 text-gray-900 ${
                erros.nome ? "border-red-500" : ""
              }`}
              placeholder="Digite o nome do produto"
            />
            {erros.nome && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {erros.nome}
              </p>
            )}
          </div>

          {/* Tipo de Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Produto *
            </label>
            <select
              name="tipo"
              value={produto.tipo}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-2 focus:ring-[#16829E] focus:ring-opacity-50 text-gray-900 bg-white ${
                erros.tipo ? "border-red-500" : ""
              }`}
            >
              <option value="Flor">Flor</option>
              <option value="Extract">Extract</option>
              <option value="Óleo">Óleo</option>
              <option value="Cápsula">Cápsula</option>
              <option value="Tópico">Tópico</option>
              <option value="Acessório">Acessório</option>
            </select>
            {erros.tipo && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {erros.tipo}
              </p>
            )}
          </div>

          {/* Strain Type (só para Flor) */}
          {produto.tipo === "Flor" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Strain
              </label>
              <select
                name="strain_type"
                value={produto.strain_type || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base rounded-md border border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-2 focus:ring-[#16829E] focus:ring-opacity-50 text-gray-900 bg-white"
              >
                <option value="Sativa">Sativa</option>
                <option value="Indica">Indica</option>
                <option value="Híbrida">Híbrida</option>
              </select>
            </div>
          )}

          {/* Canabinóide Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canabinóide Principal *
            </label>
            <select
              name="canabinoide"
              value={produto.canabinoide}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-2 focus:ring-[#16829E] focus:ring-opacity-50 text-gray-900 bg-white ${
                erros.canabinoide ? "border-red-500" : ""
              }`}
            >
              <option value="THC">THC</option>
              <option value="CBD">CBD</option>
              <option value="CBG">CBG</option>
              <option value="CBN">CBN</option>
              <option value="THCV">THCV</option>
              <option value="Misto">Misto</option>
            </select>
            {erros.canabinoide && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {erros.canabinoide}
              </p>
            )}
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade em Estoque *
            </label>
            <input
              type="number"
              name="quantidade"
              value={produto.quantidade}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-2 focus:ring-[#16829E] focus:ring-opacity-50 text-gray-900 ${
                erros.quantidade ? "border-red-500" : ""
              }`}
              placeholder="Ex: 100"
            />
            {erros.quantidade && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {erros.quantidade}
              </p>
            )}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$) *
            </label>
            <input
              type="number"
              name="preco"
              value={produto.preco}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 text-sm sm:text-base rounded-md border border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-2 focus:ring-[#16829E] focus:ring-opacity-50 text-gray-900 ${
                erros.preco ? "border-red-500" : ""
              }`}
              placeholder="Ex: 29.90"
            />
            {erros.preco && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">
                {erros.preco}
              </p>
            )}
          </div>
        </div>

        {/* Descrição - Span full width */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 text-sm sm:text-base rounded-md border border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-2 focus:ring-[#16829E] focus:ring-opacity-50 text-gray-900 resize-vertical"
            placeholder="Descreva o produto, suas características e benefícios..."
          />
        </div>

        {/* Upload de Foto */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto do Produto
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center hover:border-[#16829E] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                  id="foto-upload"
                />
                <label
                  htmlFor="foto-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FaUpload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2" />
                  <span className="text-sm sm:text-base text-gray-600">
                    Clique para fazer upload
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG até 5MB
                  </span>
                </label>
              </div>
            </div>

            {previewFoto && (
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <Image
                    src={previewFoto}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProduto((prev) => ({ ...prev, foto: null }));
                      setPreviewFoto(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags de Efeitos */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Efeitos Terapêuticos
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-md border transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-[#16829E] text-white border-[#16829E]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#16829E]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs sm:text-sm text-gray-600">
                Selecionados: {selectedTags.join(", ")}
              </p>
            </div>
          )}
        </div>
      </FormLayout>
    </MainLayout>
  );
}
