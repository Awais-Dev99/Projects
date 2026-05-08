export interface IOrder {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  shippingAddress: string;
  createdAt: string;
}