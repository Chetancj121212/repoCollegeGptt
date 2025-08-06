# Render Deployment Helper Script for CollegeGPT Backend

Write-Host "Render Deployment Script for CollegeGPT Backend" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: This is not a Git repository!" -ForegroundColor Red
    Write-Host "Please run this script from your project root directory." -ForegroundColor Yellow
    exit 1
}

# Check if render.yaml exists
if (-not (Test-Path "render.yaml")) {
    Write-Host "Error: render.yaml not found!" -ForegroundColor Red
    Write-Host "Please make sure render.yaml exists in your project root." -ForegroundColor Yellow
    exit 1
}

Write-Host "Project structure looks good!" -ForegroundColor Green

# Show current git status
Write-Host ""
Write-Host "Current Git Status:" -ForegroundColor Cyan
git status --short

# Check if there are uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host ""
    Write-Host "You have uncommitted changes:" -ForegroundColor Yellow
    git status --short
    
    $commit = Read-Host "Do you want to commit these changes before deploying? (y/n)"
    if ($commit -eq "y" -or $commit -eq "Y") {
        $message = Read-Host "Enter commit message"
        if ([string]::IsNullOrWhiteSpace($message)) {
            $message = "Pre-deployment commit"
        }
        
        Write-Host ""
        Write-Host "Committing changes..." -ForegroundColor Cyan
        git add .
        git commit -m $message
        
        Write-Host ""
        Write-Host "Pushing to remote repository..." -ForegroundColor Cyan
        git push
    }
} else {
    Write-Host ""
    Write-Host "No uncommitted changes found." -ForegroundColor Green
    
    # Push any committed changes to remote
    Write-Host ""
    Write-Host "Pushing to remote repository..." -ForegroundColor Cyan
    git push
}

Write-Host ""
Write-Host "Deployment Instructions:" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Magenta
Write-Host "1. Go to https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Click 'New +' -> 'Web Service'" -ForegroundColor White
Write-Host "3. Connect your GitHub repository" -ForegroundColor White
Write-Host "4. Render will automatically detect your render.yaml file" -ForegroundColor White
Write-Host "5. Set up your environment variables" -ForegroundColor White
Write-Host "6. Click 'Create Web Service'" -ForegroundColor White

Write-Host ""
Write-Host "Your render.yaml configuration:" -ForegroundColor Cyan
Get-Content "render.yaml"

Write-Host ""
Write-Host "Environment Variables Needed:" -ForegroundColor Red
Write-Host "=============================" -ForegroundColor Red
Write-Host "Make sure to set these in Render Dashboard:" -ForegroundColor White
Write-Host "GOOGLE_API_KEY - Your Google AI API key" -ForegroundColor Yellow
Write-Host "ASTRA_DB_API_ENDPOINT - Your DataStax Astra DB endpoint" -ForegroundColor Yellow
Write-Host "ASTRA_DB_APPLICATION_TOKEN - Your Astra DB token" -ForegroundColor Yellow
Write-Host "CLERK_SECRET_KEY - Your Clerk authentication secret" -ForegroundColor Yellow
Write-Host "AZURE_STORAGE_CONNECTION_STRING - Azure Blob Storage connection" -ForegroundColor Yellow
Write-Host "AZURE_CONTAINER_NAME - Azure Blob Storage container name" -ForegroundColor Yellow

Write-Host ""
Write-Host "Useful Links:" -ForegroundColor Green
Write-Host "Render Dashboard: https://dashboard.render.com" -ForegroundColor Blue
Write-Host "Render Docs: https://render.com/docs" -ForegroundColor Blue

$repoUrl = git remote get-url origin
Write-Host "Your Repository: $repoUrl" -ForegroundColor Blue

Write-Host ""
Write-Host "After deployment, your app will be available at:" -ForegroundColor Green
Write-Host "https://your-service-name.onrender.com" -ForegroundColor Blue

Write-Host ""
Write-Host "Post-Deployment Checklist:" -ForegroundColor Magenta
Write-Host "1. Check deployment logs in Render dashboard" -ForegroundColor White
Write-Host "2. Test your API endpoints" -ForegroundColor White
Write-Host "3. Verify environment variables are set correctly" -ForegroundColor White
Write-Host "4. Update CORS origins in main.py if needed" -ForegroundColor White
Write-Host "5. Test the /health endpoint" -ForegroundColor White
