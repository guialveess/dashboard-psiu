import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Order } from "../../types";
import { io, Socket } from "socket.io-client";

export default function LastOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para buscar os pedidos da API usando Axios
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

  useEffect(() => {
    // Conectar ao servidor Socket.io
    const socket: Socket = io("https://api-psiu-1.onrender.com");

    // Evento quando um novo pedido for recebido
    socket.on("NEW_ORDER", (newOrder: Order) => {
      console.log("Novo pedido recebido:", newOrder);

      // Adicionar o novo pedido no topo da lista
      setOrders((prevOrders) => {
        const existingOrder = prevOrders.find(
          (order) => order.id === newOrder.id
        );
        if (existingOrder) {
          // Se o pedido já existir, atualizá-lo
          return prevOrders.map((order) =>
            order.id === newOrder.id ? newOrder : order
          );
        } else {
          // Se for um novo pedido, adicioná-lo no início da lista
          return [newOrder, ...prevOrders];
        }
      });
    });

    fetchOrders();

    return () => {
      socket.disconnect();
      console.log("Desconectado do servidor Socket.io");
    };
  }, []);

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
      header: "Table Number",
      cell: ({ row }) => (
        <span className="text-[#0D062D]">
          {row.getValue("tablenumber") ?? "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") || "pending";
        const statusText = status === "success" ? "Paid" : "pending";
        const statusClass =
          status === "success" ? "text-[#34CAA5]" : "text-[#ED544E]";
        return <p className={statusClass}>{statusText}</p>;
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
      header: "Observations",
      cell: ({ row }) => (
        <span className="text-[#737373]">
          {row.getValue("observations") || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const dateStr = row.getValue<string>("createdAt");
        const date = dateStr ? new Date(dateStr) : new Date();
        const formattedDate = date.toLocaleDateString();
        return <span className="text-[#737373]">{formattedDate}</span>;
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => (
        <p className="text-[#0D062D] font-semibold">
          ${(row.getValue("totalPrice") as number).toFixed(2)}
        </p>
      ),
    },
    {
      accessorKey: "invoice",
      header: "Invoice",
      cell: ({ row }) => (
        <Link
          href={`/orders/${row.getValue<string>("id")}/invoice`}
          className="text-[#0D062D] hover:text-gray-400"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
    </div>
  );
}
