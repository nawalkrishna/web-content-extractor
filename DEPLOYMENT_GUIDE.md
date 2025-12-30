# Web Content Extractor - Deployment Guide

Follow this guide to deploy your application to the internet.

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Step 2: Deploy Backend (Render)

1. Go to https://dashboard.render.com
2. New + → Web Service
3. Connect GitHub repository
4. Settings:
   - Name: web-content-extractor-backend
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
   - Instance: Free

## Step 3: Deploy Frontend (Vercel)

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Settings:
   - Root Directory: frontend
   - Framework: Vite
4. Add environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_BACKEND_API_URL (your Render URL)

Done! Your app is live!
