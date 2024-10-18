export interface Order {
  orderId: string;
  userName: string;
  dueDate: string;
  totalAmount: string;
  dueAmount: string;
  action: string;
  products: { name: string }[];
}
