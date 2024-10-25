import { ReactNode } from "react";

// types.ts

export interface Product {
  id: string;
  name: string; // Adicione esta linha
  price: number;
  // outras propriedades do produto
}

export interface OrderItem {
  name: ReactNode;
  id: number; // ID do item
  order_id: number; // ID do pedido (opcional, dependendo do uso)
  product_id: number; // ID do produto
  quantity: number; // Quantidade do item
  price: number; // Preço do item
  created_at: string; // Data de criação
  product_name: string; // Nome do produto
  product_image: string; // URL da imagem do produto
}

export interface Order {
  id: string; // ID do pedido
  tablenumber?: string; // Número da mesa (opcional)
  status: string; // Status do pedido
  userId: string; // ID do usuário
  observations?: string; // Observações do pedido (opcional)
  createdAt: string; // Data de criação
  totalPrice: number; // Preço total
  items: OrderItem[]; // Itens do pedido
}
