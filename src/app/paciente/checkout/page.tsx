"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCreditCard,
  FaMapMarkerAlt,
  FaTruck,
} from "react-icons/fa";

interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface Pagamento {
  tipo: "credito" | "debito" | "pix";
  numeroCartao?: string;
  nomeTitular?: string;
  validade?: string;
  cvv?: string;
}

export default function Checkout() {
  const router = useRouter();
  const [endereco, setEndereco] = useState<Endereco>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [pagamento, setPagamento] = useState<Pagamento>({
    tipo: "credito",
  });

  const [etapa, setEtapa] = useState<"endereco" | "pagamento" | "confirmacao">(
    "endereco"
  );

  const handleSubmitEndereco = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa("pagamento");
  };

  const handleSubmitPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa("confirmacao");
  };

  const handleFinalizarCompra = async () => {
    try {
      // Aqui você implementaria a lógica para finalizar a compra
      // Enviando os dados para a API
      alert("Compra finalizada com sucesso!");
      router.push("/paciente/pedidos");
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      alert("Erro ao finalizar a compra. Tente novamente.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-[#16829E] hover:text-[#126a7e] mr-4"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-[#16829E]">Checkout</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Etapas do Checkout */}
        <div className="flex justify-between mb-8">
          <div
            className={`flex items-center ${
              etapa === "endereco" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaMapMarkerAlt className="w-5 h-5 mr-2" />
            <span>Endereço</span>
          </div>
          <div
            className={`flex items-center ${
              etapa === "pagamento" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaCreditCard className="w-5 h-5 mr-2" />
            <span>Pagamento</span>
          </div>
          <div
            className={`flex items-center ${
              etapa === "confirmacao" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaTruck className="w-5 h-5 mr-2" />
            <span>Confirmação</span>
          </div>
        </div>

        {/* Formulário de Endereço */}
        {etapa === "endereco" && (
          <form onSubmit={handleSubmitEndereco} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  type="text"
                  value={endereco.cep}
                  onChange={(e) =>
                    setEndereco({ ...endereco, cep: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rua
                </label>
                <input
                  type="text"
                  value={endereco.rua}
                  onChange={(e) =>
                    setEndereco({ ...endereco, rua: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  type="text"
                  value={endereco.numero}
                  onChange={(e) =>
                    setEndereco({ ...endereco, numero: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  type="text"
                  value={endereco.complemento}
                  onChange={(e) =>
                    setEndereco({ ...endereco, complemento: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                  type="text"
                  value={endereco.bairro}
                  onChange={(e) =>
                    setEndereco({ ...endereco, bairro: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  value={endereco.cidade}
                  onChange={(e) =>
                    setEndereco({ ...endereco, cidade: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input
                  type="text"
                  value={endereco.estado}
                  onChange={(e) =>
                    setEndereco({ ...endereco, estado: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#16829E] text-white px-6 py-2 rounded-md hover:bg-[#126a7e] transition-colors"
              >
                Próximo
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Pagamento */}
        {etapa === "pagamento" && (
          <form onSubmit={handleSubmitPagamento} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Pagamento
                </label>
                <select
                  value={pagamento.tipo}
                  onChange={(e) =>
                    setPagamento({
                      ...pagamento,
                      tipo: e.target.value as "credito" | "debito" | "pix",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                >
                  <option value="credito">Cartão de Crédito</option>
                  <option value="debito">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                </select>
              </div>

              {pagamento.tipo !== "pix" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={pagamento.numeroCartao}
                      onChange={(e) =>
                        setPagamento({
                          ...pagamento,
                          numeroCartao: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome do Titular
                    </label>
                    <input
                      type="text"
                      value={pagamento.nomeTitular}
                      onChange={(e) =>
                        setPagamento({
                          ...pagamento,
                          nomeTitular: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Validade
                      </label>
                      <input
                        type="text"
                        value={pagamento.validade}
                        onChange={(e) =>
                          setPagamento({
                            ...pagamento,
                            validade: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={pagamento.cvv}
                        onChange={(e) =>
                          setPagamento({ ...pagamento, cvv: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E]"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setEtapa("endereco")}
                className="text-[#16829E] hover:text-[#126a7e]"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="bg-[#16829E] text-white px-6 py-2 rounded-md hover:bg-[#126a7e] transition-colors"
              >
                Próximo
              </button>
            </div>
          </form>
        )}

        {/* Confirmação */}
        {etapa === "confirmacao" && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Resumo do Pedido
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">Endereço de Entrega:</p>
                <p className="text-gray-800">
                  {endereco.rua}, {endereco.numero}{" "}
                  {endereco.complemento && `- ${endereco.complemento}`}
                  <br />
                  {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                  <br />
                  CEP: {endereco.cep}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">Forma de Pagamento:</p>
                <p className="text-gray-800">
                  {pagamento.tipo === "credito" && "Cartão de Crédito"}
                  {pagamento.tipo === "debito" && "Cartão de Débito"}
                  {pagamento.tipo === "pix" && "PIX"}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setEtapa("pagamento")}
                className="text-[#16829E] hover:text-[#126a7e]"
              >
                Voltar
              </button>
              <button
                onClick={handleFinalizarCompra}
                className="bg-[#16829E] text-white px-6 py-2 rounded-md hover:bg-[#126a7e] transition-colors"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
