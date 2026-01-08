import { Product, Sale } from '@/types';

class Storage {
  private static readonly PRODUCTS_KEY = 'products';
  private static readonly SALES_KEY = 'sales';
  private static readonly EXPENSES_KEY = 'expenses';

  // Fetch products from API
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to localStorage for offline support
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(Storage.PRODUCTS_KEY);
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    }
  }

  // Fetch sales from API
  async getSales(): Promise<Sale[]> {
    try {
      const response = await fetch('/api/sales');
      if (!response.ok) throw new Error('Failed to fetch sales');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sales:', error);
      // Fallback to localStorage for offline support
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(Storage.SALES_KEY);
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    }
  }

  // Fetch expenses from API
  async getExpenses(): Promise<Array<{ id: string; description: string; amount: number; date: string }>> {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to fetch expenses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Fallback to localStorage for offline support
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(Storage.EXPENSES_KEY);
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    }
  }

  // Save products to API
  async setProducts(products: Product[]): Promise<void> {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      });
      if (!response.ok) throw new Error('Failed to save products');
      
      // Also save to localStorage for offline support
      if (typeof window !== 'undefined') {
        localStorage.setItem(Storage.PRODUCTS_KEY, JSON.stringify(products));
      }
    } catch (error) {
      console.error('Error saving products:', error);
      // Fallback to localStorage only
      if (typeof window !== 'undefined') {
        localStorage.setItem(Storage.PRODUCTS_KEY, JSON.stringify(products));
      }
    }
  }

  // Save sales to API
  async setSales(sales: Sale[]): Promise<void> {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sales),
      });
      if (!response.ok) throw new Error('Failed to save sales');
      
      // Also save to localStorage for offline support
      if (typeof window !== 'undefined') {
        localStorage.setItem(Storage.SALES_KEY, JSON.stringify(sales));
      }
    } catch (error) {
      console.error('Error saving sales:', error);
      // Fallback to localStorage only
      if (typeof window !== 'undefined') {
        localStorage.setItem(Storage.SALES_KEY, JSON.stringify(sales));
      }
    }
  }

  // Save expenses to API
  async setExpenses(expenses: Array<{ id: string; description: string; amount: number; date: string }>): Promise<void> {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenses),
      });
      if (!response.ok) throw new Error('Failed to save expenses');
      
      // Also save to localStorage for offline support
      if (typeof window !== 'undefined') {
        localStorage.setItem(Storage.EXPENSES_KEY, JSON.stringify(expenses));
      }
    } catch (error) {
      console.error('Error saving expenses:', error);
      // Fallback to localStorage only
      if (typeof window !== 'undefined') {
        localStorage.setItem(Storage.EXPENSES_KEY, JSON.stringify(expenses));
      }
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