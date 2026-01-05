import { Product, Sale } from '@/types';

const PRODUCTS_KEY = 'inventory_products';
const SALES_KEY = 'inventory_sales';

export const storage = {
  // Products
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProducts: (products: Product[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  // Sales
  getSales: (): Sale[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(SALES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSales: (sales: Sale[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  },

  // Clear all data
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(SALES_KEY);
  }
};
