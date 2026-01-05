'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { generateId } from '@/lib/utils';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  initialProduct?: Product;
}

export default function ProductForm({ onSubmit, onCancel, initialProduct }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    sku: initialProduct?.sku || '',
    quantity: initialProduct?.quantity || 0,
    price: initialProduct?.price || 0,
    category: initialProduct?.category || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: initialProduct?.id || generateId(),
      ...formData,
      lastUpdated: new Date().toISOString()
    };
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">SKU</label>
        <input
          type="text"
          required
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            required
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {initialProduct ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
