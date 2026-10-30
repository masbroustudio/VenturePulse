# ==============================================================================
# ⚡ Venture Pulse — Automated Pre-Flight & Vercel Production Deploy Script
# ==============================================================================

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "        ⚡ VENTURE PULSE — PRODUCTION DEPLOYMENT SUITE           " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. PRE-FLIGHT PRIVACY & GIT CHECKS
Write-Host "[1/4] Checking Secret & Submission Isolation..." -ForegroundColor Cyan

$envCheck = git check-ignore .env
if (-not $envCheck) {
    Write-Host "ERROR: .env is not ignored in .gitignore! Halting deployment." -ForegroundColor Red
    exit 1
}

$subCheck = git check-ignore submission/
if (-not $subCheck) {
    Write-Host "ERROR: submission/ directory is not ignored in .gitignore! Halting deployment." -ForegroundColor Red
    exit 1
}

Write-Host " ✓ .env and submission/ directories are strictly isolated and protected from git." -ForegroundColor Green

# 2. RUN BACKEND PYTEST SUITE
Write-Host ""
Write-Host "[2/4] Running Backend Pytest Suite (11 Tests)..." -ForegroundColor Cyan
python -m pytest backend/tests/ -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend tests failed! Resolve failures before deploying." -ForegroundColor Red
    exit 1
}
Write-Host " ✓ All backend tests passed successfully." -ForegroundColor Green

# 3. RUN FRONTEND BUILD & TYPECHECK
Write-Host ""
Write-Host "[3/4] Running Next.js Production Build Check..." -ForegroundColor Cyan
npm --prefix frontend run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend production build failed! Resolve build errors before deploying." -ForegroundColor Red
    exit 1
}
Write-Host " ✓ Next.js 15 production build compiled successfully with 0 errors." -ForegroundColor Green

# 4. DEPLOYMENT ACTION MENU
Write-Host ""
Write-Host "[4/4] Pre-flight checks passed! Choose a deployment action:" -ForegroundColor Yellow
Write-Host "  [1] Push code to GitHub (https://github.com/masbroustudio/VenturePulse.git)" -ForegroundColor White
Write-Host "  [2] Deploy to Vercel (Preview)" -ForegroundColor White
Write-Host "  [3] Deploy to Vercel Production (--prod)" -ForegroundColor Green
Write-Host "  [4] Exit" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Select option (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Pushing to GitHub remote origin/master..." -ForegroundColor Cyan
        git push -u origin master
    }
    "2" {
        Write-Host "Triggering Vercel Preview Deployment..." -ForegroundColor Cyan
        npx vercel
    }
    "3" {
        Write-Host "Triggering Vercel Production Deployment..." -ForegroundColor Green
        npx vercel --prod
    }
    Default {
        Write-Host "Exiting deployment suite. You can run 'deploy.ps1' or 'git push -u origin master' at any time." -ForegroundColor Gray
    }
}
