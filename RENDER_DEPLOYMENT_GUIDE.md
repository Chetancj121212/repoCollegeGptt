# Render Deployment Guide for CollegeGPT Backend

This guide will help you deploy your FastAPI backend to Render.

## Prerequisites

1. GitHub repository with your code (✅ You have this)
2. Render account (free tier available)
3. Environment variables ready

## Deployment Methods

### Method 1: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**

   - Visit: https://dashboard.render.com
   - Sign up/Login with your GitHub account

2. **Create New Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository: `Chetancj121212/repoCollegeGptt`

3. **Configure Service**

   - Render will automatically detect your `render.yaml` file
   - Service name: `collegegpt-backend` (or your preferred name)
   - Branch: `master`
   - Runtime: Python (auto-detected)

4. **Set Environment Variables**
   Set these required variables in the Environment tab:

   ```
   GOOGLE_API_KEY=your_google_api_key
   ASTRA_DB_API_ENDPOINT=your_astra_db_endpoint
   ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
   CLERK_SECRET_KEY=your_clerk_secret_key
   AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
   AZURE_CONTAINER_NAME=your_azure_container_name
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Your app will be available at: `https://your-service-name.onrender.com`

### Method 2: Using PowerShell Scripts

We've created helper scripts for you:

1. **Run the deployment preparation script:**

   ```powershell
   .\deploy-render-simple.ps1
   ```

2. **If you have a Render API key, use the API deployment script:**

   ```powershell
   .\render-api-deploy.ps1 -ApiKey "your-render-api-key"
   ```

3. **Test your deployment:**
   ```powershell
   .\test-render-deployment.ps1 -RenderUrl "https://your-service-name.onrender.com"
   ```

## Your Current Configuration

Your `render.yaml` is configured with:

- **Runtime:** Python
- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Free tier
- **Auto-deploy:** From master branch

## Environment Variables

| Variable                          | Description                                            | Required |
| --------------------------------- | ------------------------------------------------------ | -------- |
| `GOOGLE_API_KEY`                  | Google Generative AI API key                           | ✅       |
| `ASTRA_DB_API_ENDPOINT`           | DataStax Astra DB endpoint URL                         | ✅       |
| `ASTRA_DB_APPLICATION_TOKEN`      | Astra DB application token                             | ✅       |
| `CLERK_SECRET_KEY`                | Clerk authentication secret key                        | ✅       |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage connection                          | ✅       |
| `AZURE_CONTAINER_NAME`            | Azure container name for documents                     | ✅       |
| `ASTRA_DB_COLLECTION_NAME`        | Collection name (auto-set to "rag_chatbot_collection") | ✅       |
| `ENVIRONMENT`                     | Set to "production" (auto-set)                         | ✅       |

## Post-Deployment Steps

1. **Verify Deployment**

   - Check build logs in Render dashboard
   - Test the `/health` endpoint
   - Test the `/api/chat` endpoint

2. **Update Frontend**

   - Add your Render backend URL to your frontend's API configuration
   - Your backend URL will be: `https://your-service-name.onrender.com`

3. **Monitor**
   - Check Render dashboard for performance metrics
   - Monitor logs for any errors
   - Set up alerts if needed

## Testing Your Deployment

Use the provided test script:

```powershell
.\test-render-deployment.ps1 -RenderUrl "https://your-service-name.onrender.com"
```

Or test manually:

- **Health Check:** `GET https://your-service-name.onrender.com/health`
- **Root Endpoint:** `GET https://your-service-name.onrender.com/`
- **Chat Endpoint:** `POST https://your-service-name.onrender.com/api/chat`

## Troubleshooting

### Common Issues

1. **Build Fails**

   - Check if all requirements are in `requirements.txt`
   - Verify Python version compatibility

2. **Environment Variables Missing**

   - Double-check all required env vars are set
   - Verify values are correct (no extra spaces)

3. **Database Connection Issues**

   - Verify Astra DB credentials
   - Check if Astra DB allows connections from Render IPs

4. **CORS Issues**
   - Your main.py already includes `*.onrender.com` in allowed origins
   - If you use a custom domain, add it to CORS origins

### Getting Help

- **Render Docs:** https://render.com/docs
- **Render Dashboard:** https://dashboard.render.com
- **Support:** Use Render's support chat on their dashboard

## Free Tier Limitations

Render's free tier includes:

- 750 hours/month of runtime
- Service sleeps after 15 minutes of inactivity
- Cold start time when waking up
- 500MB RAM limit

For production use, consider upgrading to a paid plan.

## Next Steps

After successful deployment:

1. Update your frontend to use the new backend URL
2. Test all functionality end-to-end
3. Set up monitoring and alerts
4. Consider setting up a custom domain
5. Plan for scaling if needed

Your backend is now ready to serve your RAG chatbot with all the features including:

- Chat API with Gemini AI
- Astra DB vector search
- Clerk authentication
- Azure Blob Storage integration
- Data refresh capabilities
