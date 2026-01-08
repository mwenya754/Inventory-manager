import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Product } from '@/types';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM products ORDER BY last_updated DESC`;
    const products: Product[] = rows.map(row => ({
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      price: row.price,
      lastUpdated: row.last_updated,
    }));
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const products: Product[] = await request.json();
    
    // Clear existing products and insert new ones
    await sql`DELETE FROM products`;
    
    for (const product of products) {
      await sql`
        INSERT INTO products (id, name, quantity, price, last_updated)
        VALUES (${product.id}, ${product.name}, ${product.quantity}, ${product.price}, ${product.lastUpdated})
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
