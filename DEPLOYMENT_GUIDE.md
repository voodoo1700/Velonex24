# Deployment & Hostinger Configuration Guide

This guide will walk you through deploying your full-stack application using the recommended **Vercel (Frontend) + Render (Backend)** combo, and how to connect your **Hostinger domain**.

## Phase 1: Prepare Your Code for Production

Before deploying, we need to make sure your app is pushed to GitHub and configured for production environments.

1. **GitHub Repository:**
   - Create a new free repository on [GitHub](https://github.com/).
   - Push your entire `courier-logistics` folder to this repository.

2. **Add Start Script to Server:**
   - Ensure your `server/package.json` has a start script for production:
     ```json
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
     ```

## Phase 2: Deploy the Backend (Render)

We deploy the backend first so we can get its live URL, which your frontend will need to talk to.

1. **Create an Account:** Sign up at [Render.com](https://render.com/) and connect your GitHub account.
2. **New Web Service:** Click "New +" and select **Web Service**.
3. **Select Repository:** Choose your `courier-logistics` GitHub repository.
4. **Configuration:**
   - **Name:** e.g., `velonex-api`
   - **Root Directory:** Type `server` (Important!)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables:** Scroll down to the Advanced section and click "Add Environment Variable". Add your `.env` variables from the `server` folder:
   - `MONGODB_URI` = `mongodb+srv://...` (Your Atlas URL)
   - `JWT_SECRET` = `velonex24_super_secret_jwt_key_2024`
   - `CLIENT_URL` = We will update this later. For now, leave it or use a placeholder.
   - `PORT` = (Render ignores this and assigns its own, so you can skip it).
6. **Deploy:** Click "Create Web Service". 
   - Render will build and deploy the server.
   - Once live, copy your new backend URL from the top left (it will look like `https://velonex-api-xxxx.onrender.com`).

## Phase 3: Deploy the Frontend (Vercel)

1. **Create an Account:** Sign up at [Vercel.com](https://vercel.com/) and connect your GitHub account.
2. **Add New Project:** Click "Add New" -> "Project" and import your `courier-logistics` repository.
3. **Configuration:**
   - **Project Name:** e.g., `velonex-web`
   - **Framework Preset:** Select `Vite`.
   - **Root Directory:** Click "Edit", select the `client` folder, and click Continue.
4. **Environment Variables:** Open the Environment Variables dropdown.
   - Add the variable that tells your frontend where to find the backend API.
   - Name: `VITE_API_URL`
   - Value: `https://your-render-url-from-phase-2.onrender.com/api` *(Make sure to add `/api` at the end)*
5. **Deploy:** Click the "Deploy" button. Vercel will build your React application and give you a `vercel.app` URL.

## Phase 4: Connect Your Hostinger Domain

Now we connect your custom domain (e.g., `velonex24.com`) to your frontend deployed on Vercel.

### In Vercel
1. Go to your project dashboard in Vercel.
2. Click **Settings** -> **Domains**.
3. Type in your domain (e.g., `velonex24.com`) and click **Add**.
4. Vercel will provide you with DNS values to add to Hostinger (usually an A Record with an IP address like `76.76.21.21` and a CNAME record).

### In Hostinger
1. Log in to your Hostinger Control Panel.
2. Click on **Domains**, select your domain, and go to **DNS / Nameservers**.
3. **Clean Up:** Delete any existing `A` records for `@` or `CNAME` records for `www` that point to Hostinger's parked pages. *(Note: Do NOT delete MX or TXT records if you use custom email).*
4. **Add the A Record (Apex Domain):**
   - **Type:** `A`
   - **Name:** `@`
   - **Points to:** `76.76.21.21` (Verify this IP in Vercel's Domain panel)
5. **Add the CNAME Record (www Subdomain):**
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Points to:** `cname.vercel-dns.com`
6. Click **Add Record** for both.

### Final Step: Update Backend CORS

Because your frontend is now on a custom domain, you need to tell your Render backend to accept requests from it.
1. Go back to your Backend Dashboard in **Render**.
2. Go to **Environment Variables**.
3. Update `CLIENT_URL` to equal `https://yourdomain.com` (your exact Hostinger domain).
4. Render will automatically redeploy the backend with the new allowed origin!
