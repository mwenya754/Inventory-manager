import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM expenses ORDER BY date DESC`;
    const expenses: Expense[] = rows.map(row => ({
      id: row.id,
      description: row.description,
      amount: row.amount,
      date: row.date,
    }));
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const expenses: Expense[] = await request.json();
    
    // Clear existing expenses and insert new ones
    await sql`DELETE FROM expenses`;
    
    for (const expense of expenses) {
      await sql`
        INSERT INTO expenses (id, description, amount, date)
        VALUES (${expense.id}, ${expense.description}, ${expense.amount}, ${expense.date})
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
