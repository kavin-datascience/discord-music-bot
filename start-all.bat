@echo off
echo Starting Lavalink...
start "Lavalink" cmd /k "java -jar Lavalink.jar"

echo Waiting 15 seconds for Lavalink to fully start...
timeout /t 15 /nobreak

echo Starting Nyra bot...
start "Nyra Bot" cmd /k "npm start"

echo Both windows launched. Check them for "ready"/"connected" messages.
pause
