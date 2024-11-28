@echo off
REM Stop and clean up any existing containers
docker-compose down

REM Set up environment for Model services
cd model\google_search
echo SERP_API_KEY=48f5dd2aef570480a460533ece71ef9833ccbaca3fa1e8ef5721168ca6f94e96 > .env 
echo GROC_API_KEY=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 >> .env
cd ..\youtube_comment_summary
echo YOUTUBE_API_KEY=AIzaSyBmXn2FOp806pR9zsWJOSxYeF5rgMx6UQA > .env
echo GROQ_API_KEY=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 >> .env
echo HUGGINGFACE_API_KEY=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 >> .env
cd ..\chat_with_ai
echo GROC_API_KEY=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 >> .env
cd ..

REM Start model services in detached mode
docker-compose up -d --build

REM Set up environment for Backend services
cd ..\backend
echo MONGO_URI=mongodb+srv://username1:eWJeQrOM4OdkU9Oi@cluster0.dpbpr.mongodb.net/?retryWrites=true&w=majority > .env
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
