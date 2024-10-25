// components/OrderModal.tsx
"use client";
import React from "react";
import { Order } from "@/types/types";
import { Button } from "@/components/ui/button";

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h1>Detalhes do Pedido #{order.id}</h1>
        <p>Status: {order.status}</p>
        <p>Número da Mesa: {order.tablenumber ?? "N/A"}</p>
        <p>Observações: {order.observations ?? "N/A"}</p>
        <p>Data: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Preço Total: ${(order.totalPrice as number).toFixed(2)}</p>
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
};

export default OrderModal;
