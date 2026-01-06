# Inventory Manager

A Progressive Web App (PWA) for managing inventory, tracking sales, and monitoring expenses with automated weekly reporting.

## Features

- **Inventory Management**: Add, update, and delete products with real-time stock tracking
- **Sales Recording**: Record sales with flexible pricing and automatic inventory updates
- **Expense Tracking**: Log business expenses for accurate profit calculations
- **Weekly Reports**: Generate professional PDF reports for sales and stock
- **Net Revenue Tracking**: Real-time calculation of revenue minus expenses
- **PWA Support**: Install on mobile/desktop for offline-ready app experience
- **Low Stock Alerts**: Visual warnings when products fall below 10 units
- **Simple & Clean**: Minimal design, no authentication needed, perfect for in-store use

## Tech Stack

- Next.js 16 (App Router) with Turbopack
- TypeScript
- Tailwind CSS 4
- React Compiler
- PWA (Progressive Web App)
- jsPDF with autoTable for report generation
- LocalStorage (no database needed)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Inventory Page
- Add new products with name, quantity, and price
- Update stock quantities directly in the table
- View total inventory value
- See low stock warnings

### Sales Page
- Record sales by selecting a product and quantity
- View weekly sales statistics
- Download weekly reports for your manager
- Track all sales history

### Sharing with Manager
- Simply share the URL (e.g., `http://localhost:3000`)
- Manager can access both inventory and sales pages
- Reports can be downloaded and shared via email/messaging

## Data Storage

All data is stored in the browser's localStorage, making it:
- Fast and simple
- No server/database setup required
- Perfect for single-store usage
- Data persists across page refreshes

**Note**: Data is browser-specific. Clearing browser data will reset the app.

## Deployment

To deploy for production access:

```bash
npm run build
npm start
```

