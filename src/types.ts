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

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalSales: number;
  totalRevenue: number;
  productsSold: {
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  lowStock: Product[];
}
