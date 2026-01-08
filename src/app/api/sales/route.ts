import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Sale } from '@/types';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM sales ORDER BY date DESC`;
    const sales: Sale[] = rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      totalPrice: row.total_price,
      date: row.date,
    }));
    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sales: Sale[] = await request.json();
    
    // Clear existing sales and insert new ones
    await sql`DELETE FROM sales`;
    
    for (const sale of sales) {
      await sql`
        INSERT INTO sales (id, product_id, product_name, quantity, total_price, date)
        VALUES (${sale.id}, ${sale.productId}, ${sale.productName}, ${sale.quantity}, ${sale.totalPrice}, ${sale.date})
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
