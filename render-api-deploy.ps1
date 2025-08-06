# Render API Deployment Helper
# This script helps you deploy to Render using their API

param(
    [string]$ApiKey = "",
    [string]$ServiceName = "collegegpt-backend"
)

if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Host "Render API Key required!" -ForegroundColor Red
    Write-Host "Usage: .\render-api-deploy.ps1 -ApiKey 'your-api-key' [-ServiceName 'service-name']" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your API key:" -ForegroundColor Cyan
    Write-Host "1. Go to https://dashboard.render.com/account" -ForegroundColor White
    Write-Host "2. Navigate to 'API Keys' section" -ForegroundColor White
    Write-Host "3. Create a new API key" -ForegroundColor White
    exit 1
}

Write-Host "Render API Deployment" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green

# Get repository URL
try {
    $repoUrl = git remote get-url origin
    Write-Host "Repository: $repoUrl" -ForegroundColor Cyan
    
    # Extract GitHub owner and repo name
    if ($repoUrl -match "github\.com[:/]([^/]+)/([^/.]+)") {
        $owner = $matches[1]
        $repo = $matches[2] -replace "\.git$", ""
        Write-Host "Owner: $owner, Repo: $repo" -ForegroundColor Cyan
    } else {
        throw "Invalid GitHub repository URL format"
    }
} catch {
    Write-Host "Error: Could not get repository information" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Prepare service configuration
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
        @{ key = "ASTRA_DB_COLLECTION_NAME"; value = "rag_chatbot_collection" }
        @{ key = "ENVIRONMENT"; value = "production" }
    )
}

$body = $serviceConfig | ConvertTo-Json -Depth 3
$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "Creating web service..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Method Post -Headers $headers -Body $body
    
    Write-Host "SUCCESS: Service created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Details:" -ForegroundColor Cyan
    Write-Host "Name: $($response.name)" -ForegroundColor White
    Write-Host "ID: $($response.id)" -ForegroundColor White
    Write-Host "URL: $($response.serviceUrl)" -ForegroundColor Blue
    Write-Host "Dashboard: https://dashboard.render.com/web/$($response.id)" -ForegroundColor Blue
    
    Write-Host ""
    Write-Host "IMPORTANT: Set your environment variables!" -ForegroundColor Red
    Write-Host "Go to: https://dashboard.render.com/web/$($response.id)/env" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Required environment variables:" -ForegroundColor Yellow
    Write-Host "- GOOGLE_API_KEY" -ForegroundColor White
    Write-Host "- ASTRA_DB_API_ENDPOINT" -ForegroundColor White
    Write-Host "- ASTRA_DB_APPLICATION_TOKEN" -ForegroundColor White
    Write-Host "- CLERK_SECRET_KEY" -ForegroundColor White
    Write-Host "- AZURE_STORAGE_CONNECTION_STRING" -ForegroundColor White
    Write-Host "- AZURE_CONTAINER_NAME" -ForegroundColor White
    
} catch {
    Write-Host "FAILED: Could not create service" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
