@echo off
REM QUICK START SCRIPT - ApexServices (Windows)

echo ==================================================
echo ApexServices - On-Demand Service Booking System
echo ==================================================
echo.

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Found: %NODE_VERSION%
echo.

REM Check npm
echo Checking npm installation...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo Found: %NPM_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Seed database
echo Initializing database with seed data...
call npm run seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize database
    pause
    exit /b 1
)
echo Database initialized successfully!
echo.

REM Start server
echo Starting server...
echo.
echo ==================================================
echo ^🚀 Server is running!
echo ^📍 Open your browser: http://localhost:3000
echo.
echo Test Accounts:
echo   Admin: admin@services.com / admin123
echo   Customer: alice@example.com / alice123
echo   Provider: john@plumbing.com / john123
echo.
echo Press Ctrl+C to stop the server
echo ==================================================
echo.

call npm start
pause
