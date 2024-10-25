"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Order } from "@/types/types"; // Ajuste o caminho conforme necessário

const OrderDetail = () => {
  const router = useRouter();
  const { orderId } = router.query; // Obtém o ID do pedido da URL
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrderDetail = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api-psiu-1.onrender.com/orders/${orderId}`
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      // Adiciona verificação aqui
      fetchOrderDetail();
    }
  }, [orderId]);

  if (loading) {
    return <p>Carregando detalhes do pedido...</p>;
  }

  if (!order) {
    return <p>Pedido não encontrado.</p>;
  }

  return (
    <div>
      <h1>Detalhes do Pedido #{order.id}</h1>
      <p>Status: {order.status}</p>
      <p>Número da Mesa: {order.tablenumber ?? "N/A"}</p>
      <p>Observações: {order.observations ?? "N/A"}</p>
      <p>Data: {new Date(order.createdAt).toLocaleDateString()}</p>
      <p>Preço Total: ${(order.totalPrice as number).toFixed(2)}</p>
      {/* Adicione outros detalhes do pedido conforme necessário */}
    </div>
  );
};

export default OrderDetail;
