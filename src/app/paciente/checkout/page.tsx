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
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-[#16829E]">Checkout</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
          <button
            onClick={() => router.push("/paciente/medicamentos")}
            className="bg-[#16829E] text-white px-6 py-2 rounded-lg hover:bg-[#126a7e] transition-colors"
          >
            Voltar para Medicamentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Etapas do checkout */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              etapa === "pedido" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaShoppingCart />
            <span>Pedido</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              etapa === "endereco" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaMapMarkerAlt />
            <span>Endereço</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              etapa === "pagamento" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaCreditCard />
            <span>Pagamento</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              etapa === "confirmacao" ? "text-[#16829E]" : "text-gray-400"
            }`}
          >
            <FaCheckCircle />
            <span>Confirmação</span>
          </div>
        </div>

        {/* Conteúdo da etapa atual */}
        {etapa === "pedido" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-[#16829E]">
              Detalhes do Pedido
            </h2>

            {/* Lista de produtos */}
            <div className="space-y-6">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-end gap-6 p-4 bg-gray-50 rounded-lg"
                >
                  {/* Foto */}
                  <div className="relative w-24 h-24">
                    <Image
                      src={produto.foto}
                      alt={produto.nome}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Nome */}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-800">
                      {produto.nome}
                    </h3>
                  </div>

                  {/* Preço */}
                  <div className="w-32">
                    <p className="text-[#16829E] font-semibold">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>

                  {/* Controle de Quantidade */}
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleAjustarQuantidade(produto.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center border-x text-black">
                      {produto.quantidade}
                    </span>
                    <button
                      onClick={() => handleAjustarQuantidade(produto.id, 1)}
                      className="w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-32 text-right">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-[#16829E] font-semibold">
                      R$ {(produto.preco * produto.quantidade).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do pedido */}
            <div className="mt-8 pt-6 border-t">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-[#16829E] pt-3 border-t">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {etapa === "endereco" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
            <form onSubmit={handleSubmitEndereco} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {etapa === "pagamento" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
            {paymentStatus === "failed" && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                <FaTimesCircle />
                <span>Pagamento falhou. Verifique os dados do cartão.</span>
              </div>
            )}
            <form onSubmit={handleSubmitPagamento} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  value={pagamento.numeroCartao}
                  onChange={(e) => {
                    // Remove caracteres não numéricos
                    const value = e.target.value.replace(/\D/g, "");
                    setPagamento({
                      ...pagamento,
                      numeroCartao: value,
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
                  required
                  maxLength={16}
                  placeholder="Digite apenas números"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
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
                      setPagamento({
                        ...pagamento,
                        cvv: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome no Cartão
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#16829E] focus:ring-[#16829E] text-black"
                  required
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#16829E] text-white px-6 py-3 rounded-lg hover:bg-[#16829E]/90 transition-colors"
                >
                  Finalizar Compra
                </button>
              </div>
            </form>
          </div>
        )}

        {etapa === "confirmacao" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              {paymentStatus === "success" ? (
                <>
                  <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Pedido Confirmado!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Seu pedido foi recebido e está sendo processado. Você
                    receberá um e-mail com os detalhes.
                  </p>
                </>
              ) : (
                <>
                  <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Falha no Pagamento
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Ocorreu um erro ao processar seu pagamento. Por favor, tente
                    novamente.
                  </p>
                </>
              )}
              <button
                onClick={handleFinalizarCompra}
                className="bg-[#16829E] text-white px-6 py-3 rounded-lg hover:bg-[#16829E]/90 transition-colors"
              >
                Voltar para a Loja
              </button>
            </div>
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between mt-6">
          {etapa !== "pedido" && etapa !== "confirmacao" && (
            <button
              onClick={handleVoltar}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft />
              Voltar
            </button>
          )}
          {etapa !== "confirmacao" && etapa !== "pagamento" && (
            <div className={`${etapa === "pedido" ? "ml-auto" : ""}`}>
              <button
                onClick={handleContinuar}
                className="flex items-center gap-2 bg-[#16829E] text-white px-6 py-3 rounded-lg hover:bg-[#16829E]/90 transition-colors"
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
