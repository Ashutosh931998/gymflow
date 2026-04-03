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
*   **`MONGODB_URI`**: Your MongoDB Atlas connection string.
*   **`NODE_ENV`**: Set to `production`.
*   **`GEMINI_API_KEY`**: (If you're using any Gemini features).

### 5. Deploy
Click **"Deploy site"**. Netlify will build your React frontend and your Express backend (as a serverless function).

### Local Testing
To test the Netlify deployment locally, you can use the Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```
This will start both the frontend and the backend function locally.
