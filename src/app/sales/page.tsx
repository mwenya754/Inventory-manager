'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, Sale, Expense } from '@/types';
import { formatCurrency, generateId, getWeekRange } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const storedSales = localStorage.getItem('sales');
    return storedSales ? JSON.parse(storedSales) : [];
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const storedExpenses = localStorage.getItem('expenses');
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

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

    // Use custom amount if provided, otherwise calculate from quantity and product price
    const totalPrice = saleAmount ? parseFloat(saleAmount) : product.price * saleQty;

    const newSale: Sale = {
      id: generateId(),
      productId: product.id,
      productName: product.name,
      quantity: saleQty,
      totalPrice: totalPrice,
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
    setSaleAmount('');
  };

  const deleteSale = (id: string) => {
    if (confirm('Delete this sale?')) {
      saveSales(sales.filter(s => s.id !== id));
    }
  };

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  const recordExpense = () => {
    if (!expenseDescription || !expenseAmount) return;

    const newExpense: Expense = {
      id: generateId(),
      description: expenseDescription,
      amount: parseFloat(expenseAmount),
      date: new Date().toISOString()
    };

    saveExpenses([...expenses, newExpense]);
    setExpenseDescription('');
    setExpenseAmount('');
  };

  const deleteExpense = (id: string) => {
    if (confirm('Delete this expense?')) {
      saveExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const { start, end } = getWeekRange();
  const thisWeekSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= start && saleDate <= end;
  });

  const thisWeekExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });

  const weeklyRevenue = thisWeekSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const weeklyExpenses = thisWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netRevenue = weeklyRevenue - weeklyExpenses;

  const generateReport = () => {
    const doc = new jsPDF();
    let currentY = 20;

    // Get week number and format dates
    const monday = new Date(start);
    const weekNumber = Math.ceil((monday.getDate() - monday.getDay() + 1) / 7);
    
    const startDateStr = start.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endDateStr = end.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Main header
    doc.setFontSize(16);
    doc.text(`Week ${weekNumber} Sales (from ${startDateStr} through ${endDateStr})`, 14, currentY);
    currentY += 15;

    // Group sales by date
    const salesByDate: Record<string, Sale[]> = {};
    thisWeekSales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const dateKey = saleDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: '2-digit', year: 'numeric' });
      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = [];
      }
      salesByDate[dateKey].push(sale);
    });

    // Sort dates
    const sortedDates = Object.keys(salesByDate).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    // Generate tables for each day
    sortedDates.forEach((dateStr) => {
      // Check if we need a new page
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      // Day header
      doc.setFontSize(12);
      doc.text(`${dateStr}`, 14, currentY);
      currentY += 8;

      // Get sales for this day
      const daySales = salesByDate[dateStr];

      // Prepare table data
      const tableData = daySales.map((sale, idx) => [
        (idx + 1).toString(),
        sale.productName,
        sale.quantity.toString(),
        `K ${sale.totalPrice.toFixed(2)}`
      ]);

      // Generate table
      autoTable(doc, {
        startY: currentY,
        head: [['SN', 'Items', 'Quantity', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 11 },
        didDrawPage: function(data: { cursor: { y: number } | null }) {
          currentY = data.cursor ? data.cursor.y + 10 : currentY + 10;
        }
      });

      currentY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    });

    // Add summary page if needed
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }

    // Add summary section
    doc.setFontSize(12);
    doc.text('Weekly Summary', 14, currentY);
    currentY += 10;

    const summaryData = [
      ['Total Sales', thisWeekSales.length.toString()],
      ['Total Revenue', `K ${weeklyRevenue.toFixed(2)}`],
      ['Total Expenses', `K ${weeklyExpenses.toFixed(2)}`],
      ['Net Revenue', `K ${netRevenue.toFixed(2)}`]
    ];

    autoTable(doc, {
      startY: currentY,
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 11 },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 60 } }
    });

    // Save PDF
    doc.save(`weekly-sales-report-${start.toISOString().split('T')[0]}.pdf`);
  };

  const generateStockReport = () => {
    const doc = new jsPDF();
    
    // Get Monday of current week
    const monday = new Date(start);
    const weekNumber = Math.ceil((monday.getDate() - monday.getDay() + 1) / 7);
    
    // Format date
    const dateStr = monday.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    // Header
    doc.setFontSize(16);
    doc.text(`Week ${weekNumber} - Stock as at ${dateStr}`, 14, 20);
    
    // Prepare table data
    const tableData = products.map((product, index) => [
      (index + 1).toString(),
      product.name,
      product.quantity.toString()
    ]);
    
    // Generate table
    autoTable(doc, {
      startY: 30,
      head: [['SN', 'Items', 'Quantity']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 12 }
    });
    
    // Save PDF
    doc.save(`weekly-stock-report-${monday.toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
            <p className="text-gray-800 mt-1 font-medium">Record and track sales</p>
          </div>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Inventory
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Record New Sale</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 border-2 border-gray-300 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={saleAmount}
                onChange={(e) => setSaleAmount(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Expense</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Description (e.g., Electric Bill, Transportation)"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={recordExpense}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Record Expense
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">This Week Sales</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{thisWeekSales.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Weekly Revenue</h3>
            <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(weeklyRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Weekly Expenses</h3>
            <p className="text-2xl font-bold text-red-700 mt-2">{formatCurrency(weeklyExpenses)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Net Revenue</h3>
            <p className={`text-2xl font-bold mt-2 ${netRevenue >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(netRevenue)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={generateStockReport}
              disabled={products.length === 0}
              className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
            >
              Download Weekly Stock Report
            </button>
            <button
              onClick={generateReport}
              disabled={thisWeekSales.length === 0}
              className="px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
            >
              Download Weekly Sales Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Sales History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-700 font-medium">
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
                      <td className="px-6 py-4 text-green-700 font-semibold">
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

        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-700 font-medium">
                      No expenses recorded yet.
                    </td>
                  </tr>
                ) : (
                  [...expenses].reverse().map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(expense.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{expense.description}</div>
                      </td>
                      <td className="px-6 py-4 text-red-700 font-semibold">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
