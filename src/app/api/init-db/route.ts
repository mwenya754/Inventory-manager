import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        last_updated TEXT NOT NULL
      );
    `;

    // Create sales table
    await sql`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL,
        date TEXT NOT NULL
      );
    `;

    // Create expenses table
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL
      );
    `;

    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
