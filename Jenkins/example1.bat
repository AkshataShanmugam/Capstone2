
@echo off
REM Stop and clean up any existing containers
docker-compose down

REM Set up environment for Model services
cd model\google_search
echo SERP_API_KEY=<your_serpapi_key> >> .env 
echo GROQ_API_KEY=<YOUR_GROQ_APIKEY> >> .env
cd ..\youtube_comment_summary
echo YOUTUBE_API_KEY=<your_youtubev3_apikey> >> .env
echo GROQ_API_KEY=<YOUR_GROQ_APIKEY> >> .env
echo HUGGINGFACE_API_KEY=<YOUR_HF_API_KEY> >> .env
cd ..\chat_with_ai
echo GROC_API_KEY=<YOUR_GROQ_APIKEY> >> .env
cd ..

REM Start model services in detached mode
docker-compose up -d --build

REM Set up environment for Backend services
cd ..\backend
echo MONGO_URI=<YOUR_MONGO_URI> >> .env
echo PORT=5000 >> .env

REM Start backend services in detached mode
docker-compose up -d --build

REM Optional: Add health checks to verify services are running
timeout /t 10 > nul
echo Verifying services...

REM Example health check for Model services
curl -s http://localhost:8000 || echo "Model services are not reachable."

REM Example health check for Backend services
curl -s http://localhost:5000 || echo "Backend services are not reachable."

echo "Services started successfully and are running in the background."
