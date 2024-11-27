FROM python:3.9-slim

WORKDIR /app

# Copy the requirements.txt (or any other necessary files) into the container
COPY youtube_comment_summary/ /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
