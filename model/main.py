from fastapi import FastAPI
from app_google import app_google as google_app
from app_youtube import app_youtube as youtube_app
from app_chat_ai import app_chat_ai as chat_app

app = FastAPI()

# Mounting sub-applications to different routes
app.mount("/google", google_app)
app.mount("/youtube", youtube_app)
app.mount("/chat", chat_app)
