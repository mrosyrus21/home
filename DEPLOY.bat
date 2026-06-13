@echo off
cd /d "%~dp0"
echo.
echo  Deploying to GitHub Pages -- watch the lines below.
echo  When it finishes you'll see  [DONE] Pushed  or  [ERR] Push failed.
echo  This window will STAY OPEN. Do NOT press Ctrl+C.
echo ----------------------------------------------------------------
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "python -u '%~dp0deploy-github.py' 2>&1 | Tee-Object -FilePath '%~dp0deploy-log.txt'"
echo.
echo ----------------------------------------------------------------
echo  Finished. Read the lines above:
echo    [DONE] Pushed to GitHub Pages   = it worked
echo    [ERR] Push failed / red text    = copy it to Claude
echo ----------------------------------------------------------------
pause
