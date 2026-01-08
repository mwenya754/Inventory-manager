# Database Setup Instructions

## Setting up Vercel Postgres

After deploying your app to Vercel, follow these steps to enable shared data:

### 1. Create a Postgres Database in Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name for your database (e.g., "inventory-db")
6. Select a region close to your users
7. Click **Create**

### 2. Connect Database to Your Project

Vercel will automatically add the environment variables to your project.

### 3. Initialize the Database

After deployment, visit this URL to create the database tables:

```
https://your-app-url.vercel.app/api/init-db
```

You should see: `{"message":"Database initialized successfully"}`

### 4. Migrate Existing Data (Optional)

If users have existing data in localStorage, they can:
1. Export their data (add an export feature)
2. Or the app will automatically sync to the database on next save

## How It Works

- All users now share the same database
- When an employee adds products or records sales, it's saved to the shared database
- When the manager opens the app, they see all the data in real-time
- Data syncs automatically across all users
- localStorage is used as a fallback for offline support

## Local Development

For local development with the database:

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Pull environment variables: `vercel env pull .env.local`
4. Run dev server: `npm run dev`
5. Initialize database: Visit `http://localhost:3000/api/init-db`
