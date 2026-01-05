'use client';

import { useState, useEffect } from 'react';
import { Product, Sale, WeeklyReport } from '@/types';
import { storage } from '@/lib/storage';
import { formatCurrency, formatDate, getWeekRange, isDateInWeek } from '@/lib/utils';

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [report, setReport] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    setProducts(storage.getProducts());
    setSales(storage.getSales());
  }, []);

  useEffect(() => {
    generateReport();
  }, [products, sales, selectedWeekOffset]);

  const generateReport = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + (selectedWeekOffset * 7));
    const { start, end } = getWeekRange(currentDate);

    const weekSales = sales.filter(sale => isDateInWeek(sale.date, start, end));

    const productSalesMap = new Map<string, { quantity: number; revenue: number }>();
    weekSales.forEach(sale => {
      const existing = productSalesMap.get(sale.productName) || { quantity: 0, revenue: 0 };
      productSalesMap.set(sale.productName, {
        quantity: existing.quantity + sale.quantitySold,
        revenue: existing.revenue + sale.total
      });
    });

    const productsSold = Array.from(productSalesMap.entries())
      .map(([productName, data]) => ({
        productName,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const totalRevenue = weekSales.reduce((sum, sale) => sum + sale.total, 0);
    const lowStock = products.filter(p => p.quantity < 10);

    setReport({
      weekStart: start.toISOString(),
      weekEnd: end.toISOString(),
      totalSales: weekSales.length,
      totalRevenue,
      productsSold,
      lowStock
    });
  };

  const handleShare = async () => {
    if (!report) return;

    const reportText = `
Weekly Sales Report
${formatDate(report.weekStart)} - ${formatDate(report.weekEnd)}

Total Sales: ${report.totalSales}
Total Revenue: ${formatCurrency(report.totalRevenue)}

Top Products:
${report.productsSold.slice(0, 5).map((p, i) => 
  `${i + 1}. ${p.productName} - ${p.quantity} units - ${formatCurrency(p.revenue)}`
).join('\n')}

${report.lowStock.length > 0 ? `\nLow Stock Alert:\n${report.lowStock.map(p => 
  `- ${p.name}: ${p.quantity} units remaining`
).join('\n')}` : ''}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Weekly Sales Report',
          text: reportText
        });
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard(reportText);
      }
    } else {
      copyToClipboard(reportText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Report copied to clipboard!');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!report) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  const { start, end } = getWeekRange(new Date(new Date().getTime() + (selectedWeekOffset * 7 * 24 * 60 * 60 * 1000)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Weekly Reports</h2>
          <p className="text-gray-600 mt-1">View and share weekly sales reports</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ← Previous Week
              </button>
              <span className="text-lg font-medium text-gray-900">
                {formatDate(start.toISOString())} - {formatDate(end.toISOString())}
              </span>
              <button
                onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)}
                disabled={selectedWeekOffset >= 0}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next Week →
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Print
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Share Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{report.totalSales}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(report.totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Products Sold</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{report.productsSold.length}</p>
          </div>
        </div>

        {report.productsSold.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.productsSold.map((product, index) => (
                    <tr key={product.productName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {report.lowStock.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Low Stock Alert</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.lowStock.map((product) => (
                    <tr key={product.id} className="bg-yellow-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {product.quantity} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {report.productsSold.length === 0 && (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <p className="text-gray-500">No sales recorded for this week.</p>
          </div>
        )}
      </div>
    </div>
  );
}
