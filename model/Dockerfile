# Use an official Python image as the base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt into the container
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY httpx /app/httpx

RUN pip install /app/httpx
COPY . .
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
