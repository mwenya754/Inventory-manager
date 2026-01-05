// Simple types for the entire app
export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  lastUpdated: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  date: string;
}
