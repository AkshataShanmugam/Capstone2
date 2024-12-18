import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# FastAPI app instance
app_chat_ai = FastAPI()

# Fetch API key from .env file
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found. Please set it in the .env file.")

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# Request model for chat interaction
class ChatRequest(BaseModel):
    model: str  # Model name, e.g., "llama3-8b-8192"
    query: str  # User's input query

# FastAPI endpoint for chat
@app_chat_ai.post("/chat")
async def chat_interaction(request: ChatRequest):
    try:
        response = groq_client.chat.completions.create(
            messages=[
                {"role": "user", "content": request.query}
            ],
            model=request.model
        )
        # Extract the response content
        result = response.choices[0].message.content
        return {"query": request.query, "response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in Groq interaction: {str(e)}")
