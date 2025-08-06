# Test script for deployed Render backend

param(
    [Parameter(Mandatory=$true)]
    [string]$RenderUrl
)

Write-Host "Testing Render Backend Deployment" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "URL: $RenderUrl" -ForegroundColor Cyan
Write-Host ""

# Test 1: Root endpoint
Write-Host "1. Testing root endpoint (/)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$RenderUrl/" -Method Get
    Write-Host "   Status: SUCCESS" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "   Status: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Health endpoint
Write-Host "2. Testing health endpoint (/health)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$RenderUrl/health" -Method Get
    Write-Host "   Status: SUCCESS" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "   Status: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Chat endpoint (basic test)
Write-Host "3. Testing chat endpoint (/api/chat)..." -ForegroundColor Yellow
try {
    $body = @{
        question = "Hello, this is a test question"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri "$RenderUrl/api/chat" -Method Post -Body $body -Headers $headers
    Write-Host "   Status: SUCCESS" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "   Status: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing completed!" -ForegroundColor Green
Write-Host "If any tests failed, check your environment variables and logs in Render dashboard." -ForegroundColor Yellow
