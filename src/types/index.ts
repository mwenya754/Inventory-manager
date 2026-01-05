export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  lastUpdated: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantitySold: number;
  salePrice: number;
  total: number;
  date: string;
  week: string;
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
