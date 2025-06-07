"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface Order {
  id: string;
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
  status: "success" | "failed";
  trackingCode?: string;
}

export default function PedidosPaciente() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Iniciando busca de pedidos...");
        const response = await fetch("/api/orders");
        console.log("Resposta recebida:", response);

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

        if (!data || !Array.isArray(data.orders)) {
          throw new Error("Formato de dados inválido");
        }

        setOrders(data.orders);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        setError(
          "Erro ao carregar pedidos. Por favor, tente novamente mais tarde."
        );
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#16829E]">
            Meus Pedidos
          </h1>
        </div>

        {error ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-600 text-sm sm:text-base">
              Nenhum pedido encontrado
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                          <h3 className="text-sm sm:text-base font-medium text-gray-900">
                            Pedido #{order.id}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDate(order.timestamp)}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                              order.status === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status === "success" ? (
                              <span className="flex items-center text-green-600">
                                <FaCheckCircle className="mr-1" /> Sucesso
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <FaTimesCircle className="mr-1" /> Falha
                              </span>
                            )}
                          </span>

                          <div className="text-sm sm:text-base font-medium text-[#16829E]">
                            R$ {order.total.toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-3 flex-shrink-0">
                      {expandedOrders.has(order.id) ? (
                        <FaChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      ) : (
                        <FaChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedOrders.has(order.id) && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="space-y-4">
                      {/* Desktop Table */}
                      <div className="hidden sm:block">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produto
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantidade
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Preço Unit.
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subtotal
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.products.map((product) => (
                              <tr key={product.id}>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {product.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {product.quantity}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  R${" "}
                                  {product.price.toFixed(2).replace(".", ",")}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  R${" "}
                                  {(product.price * product.quantity)
                                    .toFixed(2)
                                    .replace(".", ",")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="sm:hidden space-y-3">
                        {order.products.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white rounded-lg p-3 border border-gray-100"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 flex-1">
                                {product.name}
                              </h4>
                              <div className="text-sm font-medium text-[#16829E] ml-2">
                                R${" "}
                                {(product.price * product.quantity)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Qtd:</span>{" "}
                                {product.quantity}
                              </div>
                              <div>
                                <span className="font-medium">Unit:</span> R${" "}
                                {product.price.toFixed(2).replace(".", ",")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Informações do pedido */}
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Endereço de Entrega
                            </h4>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {order.address.rua}, {order.address.numero}
                              {order.address.complemento &&
                                `, ${order.address.complemento}`}
                              <br />
                              {order.address.bairro} - {order.address.cidade},{" "}
                              {order.address.estado}
                              <br />
                              CEP: {order.address.cep}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Forma de Pagamento
                            </h4>
                            <p className="text-gray-600 text-xs sm:text-sm capitalize">
                              {order.payment.tipo}
                            </p>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-900">
                                  Total do Pedido:
                                </span>
                                <span className="font-bold text-[#16829E] text-base">
                                  R$ {order.total.toFixed(2).replace(".", ",")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
