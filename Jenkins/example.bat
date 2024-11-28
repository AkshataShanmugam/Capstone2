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
docker-compose up --build

cd ..\backend
echo MONGO_URI=mongodb+srv://username1:eWJeQrOM4OdkU9Oi@cluster0.dpbpr.mongodb.net/?retryWrites=true&w=majority > .env
echo PORT=5000 > .env
docker-compose up --build