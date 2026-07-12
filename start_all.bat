@echo off
echo Starting Noema System (Backend + Frontend)...
start "Noema Backend" cmd /c "%~dp0start_backend.bat"
start "Noema Frontend" cmd /c "%~dp0start_frontend.bat"
echo Services launched in separate windows!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
pause
