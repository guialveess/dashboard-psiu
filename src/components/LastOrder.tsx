"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Order, OrderItem } from "../../types";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useToast } from "../components/hooks/use-toast";

const socket: Socket = io("https://api-psiu-1.onrender.com");

export default function LastOrder() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api-psiu-1.onrender.com/orders"
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setSelectedOrder(null); // Limpar o pedido selecionado ao fechar a sheet
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    console.log(`Atualizando status do pedido ${orderId} para ${newStatus}`);
    try {
      // Atualiza o status no servidor
      await axios.patch(`https://api-psiu-1.onrender.com/orders/${orderId}`, {
        status: newStatus,
      });

      // Emite um evento de atualização de pedido através do socket
      socket.emit("ORDER_UPDATED", { orderId, newStatus });

      // Atualiza o estado local
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Corrigido o uso do toast para sucesso
      toast(
        `Status do pedido atualizado para "${newStatus}"`,
        {
          type: "success",
        },
        {
          description: "O status do pedido foi atualizado com sucesso.",
          duration: 5000,
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar o status do pedido:", error);

      // Corrigido o uso do toast para erro, agora dentro do catch
      toast(
        "Erro ao atualizar o status do pedido",
        {
          type: "error",
        },
        {
          description:
            "Ocorreu um erro ao tentar atualizar o status do pedido.",
          duration: 5000,
        }
      );
    }
  };

  // Função para buscar os itens de um pedido pelo ID
  const fetchOrderItems = async (orderId: string) => {
    try {
      const response = await axios.get(
        `https://api-psiu-1.onrender.com/orders/${orderId}`
      );
      console.log("Itens do Pedido:", response.data.items); // Verifique os dados aqui
      return response.data.items || [];
    } catch (error) {
      console.error("Erro ao buscar itens do pedido:", error);
      return [];
    }
  };

  // E no seu componente LastOrder
  useEffect(() => {
    console.log("Pedido Selecionado:", selectedOrder); // Verifique a estrutura do pedido
  }, [selectedOrder]);

  useEffect(() => {
    const socket: Socket = io("https://api-psiu-1.onrender.com");

    socket.on("connect", () => {
      console.log("Parabéns, Socket.IO conectado");
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO desconectado");
    });

    const playSound = () => {
      const audio = new Audio("/sounds/new-order.mp3");
      audio.play();
    };

    socket.on("NEW_ORDER", (newOrder: Order) => {
      console.log("Novo pedido recebido:", newOrder);
      playSound();
      toast(
        `Novo pedido recebido`,
        { type: "info" },
        {
          description: `Pedido #${newOrder.id} recebido com sucesso!`,
          duration: 5000,
        }
      );

      setOrders((prevOrders) => {
        const existingOrder = prevOrders.find(
          (order) => order.id === newOrder.id
        );
        if (existingOrder) {
          return prevOrders.map((order) =>
            order.id === newOrder.id ? newOrder : order
          );
        } else {
          return [newOrder, ...prevOrders];
        }
      });
    });

    socket.on("ORDER_UPDATED", ({ orderId, newStatus }) => {
      console.log(`Pedido atualizado: ${orderId}, Novo status: ${newStatus}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    });

    socket.on("confirmOrder", async ({ orderId }) => {
      await updateOrderStatus(orderId, "success");
      socket.emit("ORDER_UPDATED", { orderId, status: "success" });
    });

    fetchOrders();

    return () => {
      socket.disconnect();
    };
  }, [toast]);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="text-[#0D062D] font-semibold">
          {row.getValue<string>("id")}
        </span>
      ),
    },
    {
      accessorKey: "tablenumber",
      header: "Número. Mesa",
      cell: ({ row }) => (
        <span className="text-[#0D062D]">
          {row.getValue<string>("tablenumber") ?? "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<string>("status") || "pending";
        const statusText =
          status === "success"
            ? "Confirmado"
            : status === "pending"
            ? "Preparando"
            : status === "failed"
            ? "Cancelado"
            : status;
        const statusClass =
          status === "success"
            ? "text-[#34CAA5]"
            : status === "pending"
            ? "text-[#FFE700]"
            : status === "failed"
            ? "text-[#FF0000]"
            : "text-[#000000]";

        return <Badge className={statusClass}>{statusText}</Badge>;
      },
    },

    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => (
        <span className="text-[#0D062D]">{row.getValue<string>("userId")}</span>
      ),
    },
    {
      accessorKey: "observations",
      header: "Observações",
      cell: ({ row }) => (
        <span className="text-[#737373]">
          {row.getValue<string>("observations") || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) => {
        const dateStr = row.getValue<string>("createdAt");
        const date = dateStr ? new Date(dateStr) : new Date();
        const formattedDate = date.toLocaleDateString();
        return <span className="text-[#737373]">{formattedDate}</span>;
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Preço Total",
      cell: ({ row }) => (
        <p className="text-[#0D062D] font-semibold">
          ${(row.getValue<number>("totalPrice") as number).toFixed(2)}
        </p>
      ),
    },

    {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const orderId = row.getValue<string>("id");
        return (
          <div className="flex space-x-2">
            <Button
              onClick={async () => {
                const items = await fetchOrderItems(orderId); // Buscar itens do pedido
                setSelectedOrder({ ...row.original, items }); // Define o pedido selecionado com itens
                setSheetOpen(true); // Abre a sheet com detalhes do pedido
              }}
              variant="outline"
            >
              Ver Detalhes
            </Button>
            <Button
              onClick={() => updateOrderStatus(orderId, "pending")}
              variant="default"
            >
              Preparando
            </Button>
            <Button
              onClick={() => updateOrderStatus(orderId, "success")}
              variant="secondary"
            >
              Confirmado
            </Button>
            <Button
              onClick={() => updateOrderStatus(orderId, "failed")}
              variant="destructive"
            >
              Cancelar
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Últimos Pedidos</h1>
      <DataTable columns={columns} data={orders} />

      {sheetOpen && selectedOrder && (
        <Sheet open={sheetOpen} onOpenChange={closeSheet}>
          <SheetTrigger>
            <Button variant="outline">Ver Detalhes</Button>
            {/* Botão para abrir o Sheet */}
          </SheetTrigger>

          <SheetContent>
            <h2 className="text-xl font-bold">
              Detalhes do Pedido #{selectedOrder.id}
            </h2>
            <p>Status: {selectedOrder.status}</p>
            <p>Preço Total: ${selectedOrder.totalPrice}</p>

            {selectedOrder.observations &&
              selectedOrder.observations.length > 0 && (
                <div>
                  <h3 className="font-semibold">Observações:</h3>
                  <p>{selectedOrder.observations}</p>
                </div>
              )}

            <h3 className="font-semibold">Itens do Pedido:</h3>
            <ul>
              {Array.isArray(selectedOrder.items) &&
              selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} - ${item.price.toFixed(2)} x{" "}
                    {item.quantity}
                  </li>
                ))
              ) : (
                <li>Nenhum item encontrado.</li>
              )}
            </ul>
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
