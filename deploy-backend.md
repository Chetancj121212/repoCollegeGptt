# Backend Deployment Guide for Render

## Prerequisites

1. A Render account (https://render.com)
2. Your GitHub repository connected to Render
3. Valid API keys for all services

## Deployment Steps

### Method 1: Automatic Git-based Deployment (Recommended)

1. **Push your code to GitHub:**

   ```bash
   git add .
   git commit -m "Update render.yaml with environment variables"
   git push origin master
   ```

2. **Set up Render Service:**

   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Chetancj121212/CollegeGptt`
   - Render will automatically detect your `render.yaml` file

3. **Configure Environment Variables in Render Dashboard:**
   - GOOGLE_API_KEY: Get from https://aistudio.google.com/app/apikey
   - ASTRA_DB_API_ENDPOINT: Your Astra DB endpoint
   - ASTRA_DB_APPLICATION_TOKEN: Your Astra DB token
   - AZURE_STORAGE_CONNECTION_STRING: Your Azure storage connection string
   - AZURE_CONTAINER_NAME: Your Azure container name
   - CLERK_SECRET_KEY: Your Clerk secret key
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Your Clerk publishable key

### Method 2: Manual CLI Deployment (Alternative)

If you prefer CLI deployment, you can use the Render REST API:

```bash
# Install curl if not available
# Then use the Render API to trigger deployment
curl -X POST \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys
```

## Current Service Configuration

Based on your `render.yaml`:

- **Service Name:** collegegpt-backend
- **Runtime:** Python 3.11.0
- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

## Environment Variables Required

| Variable                          | Description                                     | Required |
| --------------------------------- | ----------------------------------------------- | -------- |
| GOOGLE_API_KEY                    | Google AI Studio API key                        | Yes      |
| ASTRA_DB_API_ENDPOINT             | Your Astra DB endpoint                          | Yes      |
| ASTRA_DB_APPLICATION_TOKEN        | Your Astra DB token                             | Yes      |
| ASTRA_DB_COLLECTION_NAME          | Collection name (set to rag_chatbot_collection) | Yes      |
| AZURE_STORAGE_CONNECTION_STRING   | Azure Blob Storage connection                   | Yes      |
| AZURE_CONTAINER_NAME              | Azure container name                            | Yes      |
| CLERK_SECRET_KEY                  | Clerk authentication secret                     | Yes      |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk publishable key                           | Yes      |

## Troubleshooting

1. **Build Failures:** Check that all dependencies in `requirements.txt` are valid
2. **Runtime Errors:** Verify all environment variables are set correctly
3. **API Key Issues:** Ensure all API keys are valid and have proper permissions

## Monitoring

- View logs in Render dashboard: https://render.com/dashboard
- Monitor service health and performance
- Set up alerts for service downtime

## Quick Deploy Command

Run this to deploy:

```bash
git add .
git commit -m "Deploy backend updates"
git push origin master
```

Your Render service will automatically deploy when changes are pushed to the master branch.
