"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrinho } from "@/contexts/CarrinhoContext";
import { useSession } from "next-auth/react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCreditCard,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Image from "next/image";
import { FormInput } from "@/components/ui";

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

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  address: Endereco;
  payment: Pagamento;
  status: "success" | "failed";
}

export default function Checkout() {
  const router = useRouter();
  const { data: session } = useSession();
  const { produtos, limparCarrinho, atualizarQuantidade } = useCarrinho();
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | null
  >(null);

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
    numeroCartao: "",
    nomeTitular: "",
    validade: "",
    cvv: "",
  });

  const [etapa, setEtapa] = useState<
    "pedido" | "endereco" | "pagamento" | "confirmacao"
  >("pedido");

  const handleSubmitEndereco = async (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa("pagamento");
  };

  const checkCardValidity = async (cardNumber: string) => {
    try {
      console.log("Verificando cartão:", cardNumber);
      const response = await fetch("/api/payment/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardNumber }),
      });
      const data = await response.json();
      console.log("Resposta da verificação:", data);
      return data.isValid;
    } catch (error) {
      console.error("Erro ao verificar cartão:", error);
      return false;
    }
  };

  const saveOrder = async (order: Order) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      return response.ok;
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      return false;
    }
  };

  const handleSubmitPagamento = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      alert("Usuário não autenticado");
      return;
    }

    // Limpa espaços e caracteres não numéricos do número do cartão
    const cardNumber = pagamento.numeroCartao?.replace(/\D/g, "") || "";

    if (!cardNumber) {
      setPaymentStatus("failed");
      return;
    }

    try {
      const isValid = await checkCardValidity(cardNumber);
      console.log("Resultado da verificação:", isValid);

      if (isValid) {
        const order: Order = {
          id: Date.now().toString(),
          userId: session.user.id,
          userName: session.user.name || "",
          userEmail: session.user.email || "",
          timestamp: new Date().toISOString(),
          products: produtos.map((produto) => ({
            id: produto.id,
            name: produto.nome,
            quantity: produto.quantidade,
            price: produto.preco,
            image: produto.foto,
          })),
          total,
          address: endereco,
          payment: pagamento,
          status: "success",
        };

        const saved = await saveOrder(order);
        if (saved) {
          setPaymentStatus("success");
          limparCarrinho();
          setEtapa("confirmacao");
        } else {
          setPaymentStatus("failed");
        }
      } else {
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setPaymentStatus("failed");
    }
  };

  const handleVoltar = () => {
    setEtapa((prev) => {
      if (prev === "endereco") return "pedido";
      if (prev === "pagamento") return "endereco";
      return prev;
    });
  };

  const handleContinuar = () => {
    setEtapa((prev) => {
      if (prev === "pedido") return "endereco";
      if (prev === "endereco") return "pagamento";
      if (prev === "pagamento") return "confirmacao";
      return prev;
    });
  };

  const handleFinalizarCompra = async () => {
    try {
      limparCarrinho();
      alert("Compra finalizada com sucesso!");
      router.push("/paciente/medicamentos");
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      alert("Erro ao finalizar a compra. Tente novamente.");
    }
  };

  const total = produtos.reduce(
    (acc, produto) => acc + produto.preco * produto.quantidade,
    0
  );

  const handleAjustarQuantidade = (produtoId: number, delta: number) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (produto) {
      const novaQuantidade = produto.quantidade + delta * 5;
      if (novaQuantidade > 0) {
        atualizarQuantidade(produtoId, novaQuantidade);
      }
    }
  };

  if (produtos.length === 0 && etapa === "pedido") {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="flex items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#16829E] text-center sm:text-left">
            Finalizar Pedido
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Seu carrinho está vazio
          </p>
          <button
            onClick={() => router.push("/paciente/medicamentos")}
            className="w-full sm:w-auto bg-[#16829E] text-white px-6 py-2 rounded-lg hover:bg-[#126a7e] transition-colors text-sm sm:text-base"
          >
            Voltar para Medicamentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Etapas do checkout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
              etapa === "pedido" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaShoppingCart className="text-sm sm:text-base" />
            <span>Pedido</span>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
              etapa === "endereco" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaMapMarkerAlt className="text-sm sm:text-base" />
            <span>Endereço</span>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
              etapa === "pagamento" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaCreditCard className="text-sm sm:text-base" />
            <span>Pagamento</span>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
              etapa === "confirmacao" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaCheckCircle className="text-sm sm:text-base" />
            <span>Confirmação</span>
          </div>
        </div>

        {/* Conteúdo da etapa atual */}
        {etapa === "pedido" && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#16829E]">
              Detalhes do Pedido
            </h2>

            {/* Lista de produtos */}
            <div className="space-y-4 sm:space-y-6">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-6 p-3 sm:p-4 bg-gray-50 rounded-lg"
                >
                  {/* Mobile: Foto e Nome juntos */}
                  <div className="flex items-center gap-3 w-full sm:hidden">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={produto.foto}
                        alt={produto.nome}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-800 truncate">
                        {produto.nome}
                      </h3>
                      <p className="text-[#16829E] font-semibold text-sm">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Desktop: Layout horizontal */}
                  <div className="hidden sm:block relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={produto.foto}
                      alt={produto.nome}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="hidden sm:block flex-1">
                    <h3 className="font-medium text-lg text-gray-800">
                      {produto.nome}
                    </h3>
                  </div>

                  <div className="hidden sm:block w-32">
                    <p className="text-[#16829E] font-semibold">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>

                  {/* Controle de Quantidade e Subtotal */}
                  <div className="flex justify-between items-center w-full sm:w-auto sm:gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleAjustarQuantidade(produto.id, -1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-black hover:bg-gray-100 rounded-l-lg text-sm sm:text-base"
                      >
                        -
                      </button>
                      <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-x text-black text-sm sm:text-base">
                        {produto.quantidade}
                      </span>
                      <button
                        onClick={() => handleAjustarQuantidade(produto.id, 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-black hover:bg-gray-100 rounded-r-lg text-sm sm:text-base"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Subtotal
                      </p>
                      <p className="text-[#16829E] font-semibold text-sm sm:text-base">
                        R$ {(produto.preco * produto.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do pedido */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-semibold text-[#16829E] pt-2 sm:pt-3 border-t">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {etapa === "endereco" && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Endereço de Entrega
            </h2>
            <form onSubmit={handleSubmitEndereco} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="CEP"
                  type="text"
                  value={endereco.cep}
                  onChange={(e) =>
                    setEndereco({ ...endereco, cep: e.target.value })
                  }
                  required
                />
                <FormInput
                  label="Rua"
                  type="text"
                  value={endereco.rua}
                  onChange={(e) =>
                    setEndereco({ ...endereco, rua: e.target.value })
                  }
                  required
                />
                <FormInput
                  label="Número"
                  type="text"
                  value={endereco.numero}
                  onChange={(e) =>
                    setEndereco({ ...endereco, numero: e.target.value })
                  }
                  required
                />
                <FormInput
                  label="Complemento"
                  type="text"
                  value={endereco.complemento}
                  onChange={(e) =>
                    setEndereco({ ...endereco, complemento: e.target.value })
                  }
                />
                <FormInput
                  label="Bairro"
                  type="text"
                  value={endereco.bairro}
                  onChange={(e) =>
                    setEndereco({ ...endereco, bairro: e.target.value })
                  }
                  required
                />
                <FormInput
                  label="Cidade"
                  type="text"
                  value={endereco.cidade}
                  onChange={(e) =>
                    setEndereco({ ...endereco, cidade: e.target.value })
                  }
                  required
                />
                <FormInput
                  label="Estado"
                  type="text"
                  value={endereco.estado}
                  onChange={(e) =>
                    setEndereco({ ...endereco, estado: e.target.value })
                  }
                  required
                />
              </div>
            </form>
          </div>
        )}

        {etapa === "pagamento" && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Pagamento</h2>
            {paymentStatus === "failed" && (
              <div className="mb-4 p-3 sm:p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm sm:text-base">
                <FaTimesCircle className="flex-shrink-0" />
                <span>Pagamento falhou. Verifique os dados do cartão.</span>
              </div>
            )}
            <form onSubmit={handleSubmitPagamento} className="space-y-4">
              <FormInput
                label="Número do Cartão"
                type="text"
                value={pagamento.numeroCartao}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPagamento({
                    ...pagamento,
                    numeroCartao: value,
                  });
                }}
                required
                maxLength={16}
                placeholder="Digite apenas números"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Validade"
                  type="text"
                  value={pagamento.validade}
                  onChange={(e) =>
                    setPagamento({
                      ...pagamento,
                      validade: e.target.value,
                    })
                  }
                  required
                />
                <FormInput
                  label="CVV"
                  type="text"
                  value={pagamento.cvv}
                  onChange={(e) =>
                    setPagamento({
                      ...pagamento,
                      cvv: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <FormInput
                label="Nome no Cartão"
                type="text"
                value={pagamento.nomeTitular}
                onChange={(e) =>
                  setPagamento({
                    ...pagamento,
                    nomeTitular: e.target.value,
                  })
                }
                required
              />
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#16829E] text-white px-6 py-3 rounded-lg hover:bg-[#16829E]/90 transition-colors text-sm sm:text-base"
                >
                  Finalizar Compra
                </button>
              </div>
            </form>
          </div>
        )}

        {etapa === "confirmacao" && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="text-center">
              {paymentStatus === "success" ? (
                <>
                  <FaCheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    Pedido Confirmado!
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Seu pedido foi recebido e está sendo processado. Você
                    receberá um e-mail com os detalhes.
                  </p>
                </>
              ) : (
                <>
                  <FaTimesCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    Falha no Pagamento
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Ocorreu um erro ao processar seu pagamento. Por favor, tente
                    novamente.
                  </p>
                </>
              )}
              <button
                onClick={handleFinalizarCompra}
                className="bg-[#16829E] text-white px-6 py-3 rounded-lg hover:bg-[#16829E]/90 transition-colors text-sm sm:text-base"
              >
                Voltar para a Loja
              </button>
            </div>
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-3 sm:gap-0">
          {etapa !== "pedido" && etapa !== "confirmacao" && (
            <button
              onClick={handleVoltar}
              className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg sm:border-none sm:px-0 sm:py-0 text-sm sm:text-base"
            >
              <FaArrowLeft />
              Voltar
            </button>
          )}
          {etapa !== "confirmacao" && etapa !== "pagamento" && (
            <div
              className={`${
                etapa === "pedido" ? "sm:ml-auto" : ""
              } w-full sm:w-auto`}
            >
              <button
                onClick={handleContinuar}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#16829E] text-white px-6 py-3 rounded-lg hover:bg-[#16829E]/90 transition-colors text-sm sm:text-base"
              >
                Continuar
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
