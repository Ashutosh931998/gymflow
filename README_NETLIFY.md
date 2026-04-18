# Netlify Deployment Guide - Gym Flow

To deploy your **Gym Flow** application to Netlify, follow these steps:

### 1. Prepare your Repository
*   Make sure all your code is pushed to a GitHub, GitLab, or Bitbucket repository.
*   The project is already configured with `netlify.toml` and a Netlify Function in `functions/api.ts`.

### 2. Connect to Netlify
1.  Log in to [Netlify](https://www.netlify.com/).
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Connect your Git provider and select your repository.

### 3. Configure Build Settings
Netlify should automatically detect the settings from `netlify.toml`:
*   **Build command:** `npm run build`
*   **Publish directory:** `dist`
*   **Functions directory:** `functions`

### 4. Set Environment Variables
In the Netlify dashboard, go to **Site settings** -> **Environment variables** and add:
*   **`MONGODB_URI`**: Your MongoDB Atlas connection string (The app now automatically ensures a database name is used).
*   **`NODE_ENV`**: Set to `production`.
*   **`GEMINI_API_KEY`**: (Required for Promo Reel feature).

### Troubleshooting Connections
If data is not appearing in Atlas:
1. **Re-deploy**: After adding the environment variable, you must click **"Trigger deploy"** -> **"Clear cache and deploy site"**.
2. **Check Logs**: In Netlify, go to **Logs** -> **Functions** -> **api**. You should see "Successfully connected to MongoDB Atlas (DB: gymflow)".
3. **Atlas Whitelist**: Ensure `0.0.0.0/0` is active in MongoDB Atlas Network Access.
