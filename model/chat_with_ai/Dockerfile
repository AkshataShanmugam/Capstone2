# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the application files into the container
COPY chat_with_ai/ /app

# Install the required Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the new port to the host
EXPOSE 8000
# testing
# Set the default command to run the FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
