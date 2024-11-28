cd model\google_search
echo SERP_API_KEY=48f5dd2aef570480a460533ece71ef9833ccbaca3fa1e8ef5721168ca6f94e96 > .env 
echo GROC_API_KEY=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 >> .env
cd ..\youtube_comment_summary
echo YOUTUBE_API_KEY=AIzaSyBmXn2FOp806pR9zsWJOSxYeF5rgMx6UQA > .env
echo GROQ_API_KEY=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 >> .env
echo HUGGINGFACE_API_KEY=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 >> .env
cd ..
docker-compose up --build