"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Image from "next/image";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

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
      } finally {
        setLoading(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#16829E]">Meus Pedidos</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">
            Erro ao carregar pedidos. Por favor, tente novamente mais tarde.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 font-medium">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-gray-700">
                    {expandedOrders.has(order.id) ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-black">
                      Pedido #{order.id}
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(order.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-black">
                      R${order.total.toFixed(2)}
                    </div>
                    <div className="text-sm">
                      {order.status === "success" ? (
                        <span className="flex items-center text-green-600">
                          <FaCheckCircle className="mr-1" /> Sucesso
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <FaTimesCircle className="mr-1" /> Falha
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {expandedOrders.has(order.id) && (
                <div className="border-t p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-black mb-2">Produtos</h3>
                      <ul className="space-y-4">
                        {order.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="relative w-16 h-16">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-black">
                                {product.name}
                              </p>
                              <p className="text-gray-700">
                                {product.quantity} x R${" "}
                                {product.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-black font-semibold">
                              R$ {(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium text-black mb-2">
                        Endereço de Entrega
                      </h3>
                      <div className="text-sm text-gray-800">
                        <p>
                          {order.address.rua}, {order.address.numero}
                        </p>
                        {order.address.complemento && (
                          <p>{order.address.complemento}</p>
                        )}
                        <p>{order.address.bairro}</p>
                        <p>
                          {order.address.cidade} - {order.address.estado}
                        </p>
                        <p>CEP: {order.address.cep}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-black mb-2">Pagamento</h3>
                      <div className="text-sm text-gray-800">
                        <p>Tipo: {order.payment.tipo}</p>
                        <p>
                          Cartão: **** **** ****{" "}
                          {order.payment.numeroCartao.slice(-4)}
                        </p>
                        <p>Titular: {order.payment.nomeTitular}</p>
                        <p>Validade: {order.payment.validade}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-black mb-2">
                        Rastreamento
                      </h3>
                      <div className="text-sm">
                        {order.trackingCode ? (
                          <span className="text-[#16829E] font-medium">
                            Código: {order.trackingCode}
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            Aguardando código de rastreamento
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
