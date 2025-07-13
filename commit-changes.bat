@echo off
set /p msg="Enter commit message: "
git add .
git commit -m "%msg%"
git pull origin main
if %errorlevel% neq 0 exit /b %errorlevel%
git push origin main