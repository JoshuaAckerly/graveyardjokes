@echo off
echo Starting Graveyard Jokes Development Servers...
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
echo.

start "Graveyard Jokes Backend" cmd /k "php artisan serve --port=8000"
timeout /t 2 /nobreak >nul
start "Graveyard Jokes Frontend" cmd /k "npm run dev"

echo Development servers started!
echo Press any key to exit...
pause >nul