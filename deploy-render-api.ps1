#!/usr/bin/env pwsh

# Render API Deployment Script
# This script uses Render's API to create a new web service

param(
    [Parameter(Mandatory=$true)]
    [string]$RenderApiKey,
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "collegegpt-backend",
    
    [Parameter(Mandatory=$false)]
    [string]$RepoUrl
)

Write-Host "🚀 Creating Render Web Service via API" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Get repository URL if not provided
if (-not $RepoUrl) {
    try {
        $RepoUrl = git remote get-url origin
        Write-Host "📍 Using repository: $RepoUrl" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error: Could not get repository URL from git" -ForegroundColor Red
        Write-Host "Please provide the repository URL using -RepoUrl parameter" -ForegroundColor Yellow
        exit 1
    }
}

# Extract owner and repo name from URL
if ($RepoUrl -match "github\.com[:/]([^/]+)/([^/.]+)") {
    $owner = $matches[1]
    $repo = $matches[2] -replace "\.git$", ""
    Write-Host "📂 Repository: $owner/$repo" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error: Invalid GitHub repository URL format" -ForegroundColor Red
    exit 1
}

# Prepare the service configuration
$serviceConfig = @{
    type = "web_service"
    name = $ServiceName
    repo = "https://github.com/$owner/$repo"
    branch = "master"
    runtime = "python"
    buildCommand = "pip install -r backend/requirements.txt"
    startCommand = "cd backend && uvicorn main:app --host 0.0.0.0 --port `$PORT"
    plan = "free"
    envVars = @(
        @{ key = "GOOGLE_API_KEY"; value = "" }
        @{ key = "ASTRA_DB_API_ENDPOINT"; value = "" }
        @{ key = "ASTRA_DB_APPLICATION_TOKEN"; value = "" }
        @{ key = "ASTRA_DB_COLLECTION_NAME"; value = "rag_chatbot_collection" }
        @{ key = "CLERK_SECRET_KEY"; value = "" }
        @{ key = "AZURE_STORAGE_CONNECTION_STRING"; value = "" }
        @{ key = "AZURE_CONTAINER_NAME"; value = "" }
        @{ key = "ENVIRONMENT"; value = "production" }
    )
}

$body = $serviceConfig | ConvertTo-Json -Depth 3

# Headers for the API request
$headers = @{
    "Authorization" = "Bearer $RenderApiKey"
    "Content-Type" = "application/json"
}

Write-Host "`n🔄 Creating web service..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Method Post -Headers $headers -Body $body
    
    Write-Host "✅ Service created successfully!" -ForegroundColor Green
    Write-Host "📋 Service Details:" -ForegroundColor Cyan
    Write-Host "   Name: $($response.name)" -ForegroundColor White
    Write-Host "   ID: $($response.id)" -ForegroundColor White
    Write-Host "   URL: $($response.serviceUrl)" -ForegroundColor Blue
    Write-Host "   Dashboard: https://dashboard.render.com/web/$($response.id)" -ForegroundColor Blue
    
    Write-Host "`n⚠️  Important: You need to set your environment variables!" -ForegroundColor Yellow
    Write-Host "Go to: https://dashboard.render.com/web/$($response.id)/env" -ForegroundColor Blue
    
} catch {
    Write-Host "❌ Error creating service:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n📝 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Set your environment variables in the Render dashboard" -ForegroundColor White
Write-Host "2. Trigger a manual deploy if needed" -ForegroundColor White
Write-Host "3. Monitor the deployment logs" -ForegroundColor White
Write-Host "4. Test your API endpoints" -ForegroundColor White
