@echo off
setlocal

REM ---------------------------------------------------------------
REM  MNM-Edu local launcher
REM  Double-click to start the static preview server on port 3041
REM  and open your default browser to it.
REM ---------------------------------------------------------------

title MNM-Edu preview server (port 3041)

REM Always run from the project root, regardless of where the .bat is invoked from.
cd /d "%~dp0"

REM If the static export doesn't exist yet, build it first.
if not exist "out\index.html" (
  echo.
  echo  out/ not found - building the site first. This takes ~1 minute.
  echo.
  call npx next build
  if errorlevel 1 (
    echo.
    echo  Build failed. See the output above.
    echo.
    pause
    exit /b 1
  )
)

echo.
echo  Opening http://localhost:3041/ in your default browser...
echo.

REM Open the browser in the background; the server starts in this window.
start "" "http://localhost:3041/"

REM Run the server (foreground). Ctrl+C in this window stops it.
node "%~dp0scripts\serve.js" 3041

echo.
echo  Server stopped. Press any key to close this window.
pause >nul
