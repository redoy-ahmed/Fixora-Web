@echo off
echo =======================================================================
echo              Fixora Admin Web Portal - Quick Launcher
echo =======================================================================
echo.

cd /d "%~dp0"

if not exist node_modules (
    echo Installing node dependencies...
    call npm install
)

echo Starting Vite Development Server at http://localhost:3000 ...
call npm run dev
