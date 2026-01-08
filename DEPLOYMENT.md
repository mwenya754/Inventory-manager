# Deployment Instructions

## Deploy to Vercel with Shared Database

### Step 1: Deploy Your App

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 2: Add Vercel Postgres Database

1. After deployment, go to your project dashboard on [vercel.com](https://vercel.com)
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Name it (e.g., "inventory-db")
6. Click **Create**

Vercel will automatically connect the database to your project.

### Step 3: Initialize Database Tables

Visit this URL (replace with your actual domain):
```
https://your-app.vercel.app/api/init-db
```

You should see: `{"message":"Database initialized successfully"}`

### Step 4: Share the Link!

Now when you share your app URL with others:
- Everyone sees the same data
- Employee adds products → Manager sees them immediately
- Sales recorded by anyone → Visible to everyone
- All data is synchronized across all users

## How Data Sharing Works

✅ **Before**: Each user had their own data (localStorage only)  
✅ **After**: Everyone shares the same database (Vercel Postgres)

- Products, sales, and expenses are stored in a shared database
- Updates from any user are immediately available to all users
- localStorage is still used as a backup for offline support

## Need Help?

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed database setup instructions.
