@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules\p5" (
  call npm ci
  if errorlevel 1 exit /b 1
)
node tools\start.mjs
