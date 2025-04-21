"use client";

import { useState, useRef } from "react";
import { FaTimes, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import Image from "next/image";

interface ModalReceitasProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onUploadSuccess?: () => void;
}

export default function ModalReceitas({
  isOpen,
  onCloseAction,
  onUploadSuccess,
}: ModalReceitasProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [observacoes, setObservacoes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 25, 50));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Por favor, selecione um arquivo");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("observacoes", observacoes);

      const response = await fetch("/api/receitas/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar receita");
      }

      const data = await response.json();
      console.log("Receita enviada com sucesso:", data);

      setFile(null);
      setObservacoes("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      onCloseAction();
    } catch (error) {
      console.error("Erro ao enviar receita:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao enviar receita"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#16829E]">Enviar Receita</h2>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload da Receita
              </label>
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#16829E] file:text-white
                    hover:file:bg-[#126a7e]"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Formatos aceitos: PDF, JPG, JPEG, PNG
              </p>
              {file && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">
                      Arquivo selecionado: {file.name}
                    </p>
                    <div className="flex items-center space-x-2 bg-gray-100 px-2 py-1 rounded">
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        className="p-1 text-gray-600 hover:text-[#16829E]"
                        title="Diminuir zoom"
                      >
                        <FaSearchMinus />
                      </button>
                      <span className="text-sm text-gray-600">{zoom}%</span>
                      <button
                        type="button"
                        onClick={handleZoomIn}
                        className="p-1 text-gray-600 hover:text-[#16829E]"
                        title="Aumentar zoom"
                      >
                        <FaSearchPlus />
                      </button>
                    </div>
                  </div>
                  <div
                    ref={previewRef}
                    className="border rounded-lg overflow-hidden bg-gray-50"
                    style={{ height: "500px" }}
                  >
                    {file.type === "application/pdf" ? (
                      <iframe
                        src={URL.createObjectURL(file)}
                        className="w-full h-full"
                        style={{
                          transform: `scale(${zoom / 100})`,
                          transformOrigin: "0 0",
                        }}
                        title="Preview do arquivo"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          fill
                          className="object-contain"
                          style={{
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: "0 0",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16829E]"
                rows={4}
                placeholder="Adicione observações sobre a receita (opcional)"
              />
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-white bg-[#16829E] rounded-md hover:bg-[#126a7e] disabled:opacity-50"
            >
              {isProcessing ? "Enviando..." : "Enviar Receita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
