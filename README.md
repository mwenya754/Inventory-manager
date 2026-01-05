# Inventory Manager

A simple web application for tracking stock, managing inventory, and recording sales. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Inventory Management**: Add, edit, and delete products with real-time stock tracking
- **Sales Tracking**: Record sales transactions with automatic stock updates
- **Weekly Reports**: Generate and share weekly sales reports
- **Low Stock Alerts**: Get notified when products are running low
- **Search & Filter**: Easily find products in your inventory
- **Local Storage**: All data persists in browser localStorage (no backend required)

## Getting Started

First, install dependencies:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Inventory Management
- Navigate to the main page to view all products
- Click "Add Product" to add new items to inventory
- Update quantities directly in the table
- Edit or delete products as needed
- Low stock items (< 10 units) are highlighted

### Recording Sales
- Go to the "Sales" page
- Select a product, enter quantity, and optionally adjust price
- Click "Record Sale" to complete the transaction
- Stock is automatically updated

### Weekly Reports
- Visit the "Reports" page to view weekly summaries
- Navigate between weeks to view historical data
- See top-selling products and total revenue
- Print or share reports with your manager

## Sharing the App

Since this app uses localStorage, you can:
1. Deploy it to Vercel, Netlify, or any static hosting service
2. Share the URL with your team
3. Each user will have their own local data storage

For shared data across team members, consider adding a backend database in the future.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **localStorage** - Client-side data persistence

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
