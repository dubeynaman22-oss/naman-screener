@echo off
title ScreenCraft - AI Resume Screener
echo Starting ScreenCraft Resume Screener server...
cd /d "%~dp0"
start "" http://localhost:3000
agy-node server.js
if %ERRORLEVEL% NEQ 0 (
  echo agy-node not found, attempting node...
  node server.js
)
pause
