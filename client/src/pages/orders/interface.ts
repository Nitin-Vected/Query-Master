export interface Order {
  id: string;
  userName: string;
  dueDate: string;
  amount: string;
  dueAmount: string;
  action: string;
  contactNumber: string;
  email: string;
  products: string[];
  transactions: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Transaction {
  id: string
  mode: string
  amount: number
  date: string
}
