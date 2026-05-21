FROM python:3.10-slim

WORKDIR /app

# Copy the requirements file from the backend folder
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy both backend and frontend directories
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Expose port 8080 (Cloud Run's default expected port)
EXPOSE 8080

# Start Uvicorn, pointing it to the FastAPI app in the backend directory
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
