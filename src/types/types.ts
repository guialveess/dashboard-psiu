export interface Item {
  id: string; // ID do produto
  name: string; // Nome do produto
  price: number; // Preço do produto
  imageUrl?: string; // URL da imagem do produto, opcional
}

export interface Order {
  id: string; // ID do pedido
  tablenumber?: string | null; // Número da mesa, opcional
  status: string; // Status do pedido, ex: 'pending', 'success', 'failed'
  userId: string; // ID do usuário que fez o pedido
  observations?: string | null; // Observações sobre o pedido, opcional
  createdAt: string; // Data de criação do pedido
  totalPrice: number; // Preço total do pedido
  items: Item[]; // Lista de itens do pedido
  orderItems: Array<{
    productId: string; // ID do produto
    quantity: number; // Quantidade do produto no pedido
  }>; // Itens do pedido, um array de produtos com suas quantidades
}

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
}
