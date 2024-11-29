from fastapi import FastAPI
from app_google import app_google as google_app
from app_youtube import app_youtube as youtube_app
from app_chat_ai import app_chat_ai as chat_app

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Mounting sub-applications to different routes
app.mount("/google", google_app)
app.mount("/youtube", youtube_app)
app.mount("/chat", chat_app)
