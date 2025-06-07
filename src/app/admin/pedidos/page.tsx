"use client";

import { useState, useEffect } from "react";
import ModalOrdersAdmin from "@/components/ModalOrdersAdmin";
import MainLayout from "@/components/MainLayout"; // Import MainLayout

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

export default function Pedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Set loading true at the start
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Erro ao carregar pedidos");
        }
        const data = await response.json();
        setOrders(data.orders || []); // Ensure orders is an array
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        setOrders([]); // Set empty array on error
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

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#16829E]">
            Pedidos
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-gray-600 text-sm sm:text-base">
              Carregando pedidos...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 sm:py-10 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <p className="text-gray-600 text-sm sm:text-base">
              Nenhum pedido encontrado
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rastreio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                        title="Clique para ver detalhes"
                      >
                        <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
                          {formatDate(order.timestamp)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
                          {order.userName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
                          {order.userEmail}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
                          R$ {order.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {order.status === "success" ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Sucesso
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Falha
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 whitespace-nowrap">
                          {order.trackingCode ? (
                            <span className="text-[#16829E] font-medium">
                              {order.trackingCode}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        Pedido #{order.id}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <span className="text-sm font-medium text-gray-900">
                        R$ {order.total.toFixed(2)}
                      </span>
                      {order.status === "success" ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Sucesso
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Falha
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Cliente</p>
                      <p className="text-sm text-gray-900">{order.userName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {order.userEmail}
                      </p>
                    </div>
                    {order.trackingCode && (
                      <div>
                        <p className="text-xs text-gray-500">Rastreio</p>
                        <p className="text-sm text-[#16829E] font-medium">
                          {order.trackingCode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedOrder && (
        <ModalOrdersAdmin
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </MainLayout>
  );
}
