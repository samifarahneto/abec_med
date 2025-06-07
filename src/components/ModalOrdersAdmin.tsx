import {
  FaTimes,
  FaUser,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
} from "react-icons/fa";
import { useState } from "react";
import { FormInput } from "@/components/ui";

interface Order {
  id: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  total: number;
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  status: "success" | "failed";
  address: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  payment: {
    tipo: string;
    numeroCartao: string;
    nomeTitular: string;
    validade: string;
    cvv: string;
  };
  trackingCode?: string;
}

interface ModalOrdersAdminProps {
  order: Order;
  onClose: () => void;
}

export default function ModalOrdersAdmin({
  order,
  onClose,
}: ModalOrdersAdminProps) {
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState(order.trackingCode || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleTrackingSubmit = async () => {
    try {
      setIsSaving(true);
      console.log("Iniciando envio do código de rastreio");
      console.log("Código de rastreio:", trackingCode);
      console.log("ID do pedido:", order.id);

      if (!trackingCode.trim()) {
        throw new Error("Por favor, insira um código de rastreio válido");
      }

      const response = await fetch(`/api/orders/${order.id}/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingCode }),
      });

      console.log("Status da resposta:", response.status);
      const data = await response.json();
      console.log("Dados da resposta:", data);

      if (!response.ok) {
        throw new Error(data.error || "Falha ao salvar código de rastreio");
      }

      if (!data.success) {
        throw new Error("Falha ao salvar código de rastreio");
      }

      if (!data.order) {
        throw new Error("Dados do pedido não retornados");
      }

      order.trackingCode = data.order.trackingCode;
      setShowTrackingModal(false);
      setTrackingCode("");
    } catch (error) {
      console.error("Erro detalhado:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar código de rastreio. Tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#16829E] to-[#1A9DB7] p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaShoppingCart className="w-5 h-5" />
              Detalhes do Pedido
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 md:p-4 rounded-lg -mx-4 md:mx-0">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  ID do Pedido
                </h3>
                <p className="text-gray-800 font-medium">{order.id}</p>
              </div>
              <div className="bg-gray-50 p-4 md:p-4 rounded-lg -mx-4 md:mx-0">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Data
                </h3>
                <p className="text-gray-800 font-medium">
                  {new Date(order.timestamp).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 md:p-4 rounded-lg -mx-4 md:mx-0">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Status
                </h3>
                <p
                  className={`font-medium ${
                    order.status === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status === "success" ? "Sucesso" : "Falha"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 md:p-4 rounded-lg -mx-4 md:mx-0">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Valor Total
                </h3>
                <p className="text-gray-800 font-medium">
                  R${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Informações do Cliente */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-4 -mx-4 md:mx-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-[#16829E]" />
                Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Nome
                  </h4>
                  <p className="text-gray-800">{order.userName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Email
                  </h4>
                  <p className="text-gray-800">{order.userEmail}</p>
                </div>
              </div>
            </div>

            {/* Produtos */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-4 -mx-4 md:mx-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShoppingCart className="text-[#16829E]" />
                Produtos
              </h3>
              <div className="space-y-3">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors -mx-4 md:mx-0"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-gray-800 font-medium">
                        R${product.price.toFixed(2)} (g)
                      </p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Quantidade: {product.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: R${(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      Total do Pedido
                    </p>
                    <p className="text-xl font-bold text-[#16829E]">
                      R${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-4 -mx-4 md:mx-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#16829E]" />
                Endereço de Entrega
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Rua
                  </h4>
                  <p className="text-gray-800">{order.address.rua}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Número
                  </h4>
                  <p className="text-gray-800">{order.address.numero}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Complemento
                  </h4>
                  <p className="text-gray-800">{order.address.complemento}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Bairro
                  </h4>
                  <p className="text-gray-800">{order.address.bairro}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Cidade
                  </h4>
                  <p className="text-gray-800">{order.address.cidade}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Estado
                  </h4>
                  <p className="text-gray-800">{order.address.estado}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    CEP
                  </h4>
                  <p className="text-gray-800">{order.address.cep}</p>
                </div>
                {order.trackingCode && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">
                      Rastreio
                    </h4>
                    <p className="text-gray-800">{order.trackingCode}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setTrackingCode(order.trackingCode || "");
                  setShowTrackingModal(true);
                }}
                className="mt-4 w-full bg-[#16829E] text-white py-2 px-4 rounded-lg hover:bg-[#1A9DB7] transition-colors flex items-center justify-center gap-2"
              >
                <FaTruck className="w-4 h-4" />
                {order.trackingCode ? "Alterar Rastreio" : "Inserir Rastreio"}
              </button>
            </div>

            {/* Pagamento */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-4 -mx-4 md:mx-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-[#16829E]" />
                Pagamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Tipo
                  </h4>
                  <p className="text-gray-800">{order.payment.tipo}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Nome do Titular
                  </h4>
                  <p className="text-gray-800">{order.payment.nomeTitular}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Número do Cartão
                  </h4>
                  <p className="text-gray-800">
                    **** **** **** {order.payment.numeroCartao.slice(-4)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Validade
                  </h4>
                  <p className="text-gray-800">{order.payment.validade}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Rastreio */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaTruck className="text-[#16829E]" />
                Inserir Código de Rastreio
              </h3>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Código de Rastreio"
                type="text"
                placeholder="Código de rastreamento..."
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleTrackingSubmit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#16829E] text-white rounded-lg hover:bg-[#1A9DB7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
