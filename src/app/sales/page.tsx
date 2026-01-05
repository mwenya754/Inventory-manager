'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Sale } from '@/types';
import { formatCurrency, generateId, getWeekRange } from '@/lib/utils';

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedSales = localStorage.getItem('sales');
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedSales) setSales(JSON.parse(storedSales));
  }, []);

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem('sales', JSON.stringify(newSales));
  };

  const recordSale = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product || !quantity) return;
    
    const saleQty = parseInt(quantity);
    if (saleQty > product.quantity) {
      alert('Not enough stock!');
      return;
    }

    const newSale: Sale = {
      id: generateId(),
      productId: product.id,
      productName: product.name,
      quantity: saleQty,
      totalPrice: product.price * saleQty,
      date: new Date().toISOString()
    };

    // Update product quantity
    const updatedProducts = products.map(p =>
      p.id === product.id ? { ...p, quantity: p.quantity - saleQty, lastUpdated: new Date().toISOString() } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    saveSales([...sales, newSale]);
    setSelectedProduct('');
    setQuantity('');
  };

  const deleteSale = (id: string) => {
    if (confirm('Delete this sale?')) {
      saveSales(sales.filter(s => s.id !== id));
    }
  };

  const { start, end } = getWeekRange();
  const thisWeekSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= start && saleDate <= end;
  });

  const weeklyRevenue = thisWeekSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  const generateReport = () => {
    const report = {
      week: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      totalSales: thisWeekSales.length,
      totalRevenue: weeklyRevenue,
      salesByProduct: thisWeekSales.reduce((acc, sale) => {
        if (!acc[sale.productName]) {
          acc[sale.productName] = { quantity: 0, revenue: 0 };
        }
        acc[sale.productName].quantity += sale.quantity;
        acc[sale.productName].revenue += sale.totalPrice;
        return acc;
      }, {} as Record<string, { quantity: number; revenue: number }>),
      sales: thisWeekSales
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-report-${start.toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
            <p className="text-gray-600 mt-1">Record and track sales</p>
          </div>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Inventory
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">This Week Sales</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{thisWeekSales.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Weekly Revenue</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(weeklyRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center">
            <button
              onClick={generateReport}
              disabled={thisWeekSales.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Download Weekly Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Record New Sale</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.quantity})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={recordSale}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Record Sale
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Sales History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  [...sales].reverse().map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(sale.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{sale.productName}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{sale.quantity}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">
                        {formatCurrency(sale.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteSale(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
