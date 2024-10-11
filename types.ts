// types.ts
export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  orderStatus: string;
  isPaid: boolean;
  amount: number;
  userId: string;
  orderItems: OrderItem[];
}
