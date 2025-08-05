# 🚀 Quick Backend Deployment Guide

## Step 1: Deploy to Render

### Option A: One-Click Deploy (Easiest)

Click this button to deploy directly to Render:
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Chetancj121212/CollegeGptt)

### Option B: Manual Setup

1. Go to [Render Dashboard](https://render.com/dashboard)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Chetancj121212/CollegeGptt`
4. Configure:
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Python Version:** 3.11.0

## Step 2: Set Environment Variables

In your Render service settings, add these environment variables with your actual values:

```bash
PYTHON_VERSION=3.11.0
ENVIRONMENT=production
GOOGLE_API_KEY=your_google_api_key_from_env_file
ASTRA_DB_API_ENDPOINT=your_astra_db_endpoint_from_env_file
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token_from_env_file
ASTRA_DB_COLLECTION_NAME=rag_chatbot_collection
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string_from_env_file
AZURE_CONTAINER_NAME=your_azure_container_name_from_env_file
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_from_env_file
CLERK_SECRET_KEY=your_clerk_secret_key_from_env_file
```

**Note:** Copy the actual values from your `backend/.env` file for each of these variables.

## Step 3: Deploy

Once you save the environment variables, Render will automatically build and deploy your backend.

## Step 4: Verify Deployment

Your backend will be available at: `https://your-service-name.onrender.com`

Test endpoints:

- `GET /` - Should return API status
- `POST /api/chat` - Chat endpoint

## Alternative: Deploy without GitHub

If you want to avoid GitHub secrets issues, you can:

1. **Direct Upload:** Zip your backend folder and upload directly to Render
2. **Use Render CLI** (after fixing the tool issues)
3. **Deploy via Docker** using the Dockerfile

Let me know which method you prefer!
