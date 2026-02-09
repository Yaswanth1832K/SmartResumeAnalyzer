@echo off
start cmd /k "cd backend && python app.py"
start cmd /k "cd frontend && npm run dev"
echo Application starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
