import { Product, Sale } from '@/types';

class Storage {
  private static readonly PRODUCTS_KEY = 'products';
  private static readonly SALES_KEY = 'sales';
  private static readonly EXPENSES_KEY = 'expenses';

  getProducts(): Product[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(Storage.PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getSales(): Sale[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(Storage.SALES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getExpenses(): Array<{ id: string; description: string; amount: number; date: string }> {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(Storage.EXPENSES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  setProducts(products: Product[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(Storage.PRODUCTS_KEY, JSON.stringify(products));
    }
  }

  setSales(sales: Sale[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(Storage.SALES_KEY, JSON.stringify(sales));
    }
  }

  setExpenses(expenses: Array<{ id: string; description: string; amount: number; date: string }>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(Storage.EXPENSES_KEY, JSON.stringify(expenses));
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(Storage.PRODUCTS_KEY);
      localStorage.removeItem(Storage.SALES_KEY);
      localStorage.removeItem(Storage.EXPENSES_KEY);
    }
  }
}

export const storage = new Storage();