"use client";

import { useState, useEffect } from "react";
import ModalOrdersAdmin from "@/components/ModalOrdersAdmin";

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
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Erro ao carregar pedidos");
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#16829E]">Pedidos</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    ID do Pedido
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Data
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Nome do Usuário
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Valor Total
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Rastreio
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-3 px-4 text-gray-800">{order.id}</td>
                    <td className="py-3 px-4 text-gray-800">
                      {formatDate(order.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {order.userName}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {order.userEmail}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      R${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {order.status === "success" ? (
                        <span className="text-green-600 font-medium">
                          Sucesso
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">Falha</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
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
      )}

      {selectedOrder && (
        <ModalOrdersAdmin
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
