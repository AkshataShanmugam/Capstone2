FROM python:3.9-slim

WORKDIR /app

COPY non_existent_file.txt /app
COPY google_search/ /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["/bin/sh", "-c", "uvicorn app:app --host 0.0.0.0 --port 8000"]
# CMD ["/bin/sh", "-c", "ls"]

