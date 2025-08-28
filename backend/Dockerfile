# Use official Python slim image
FROM python:3.11-slim

# Prevent Python from writing .pyc files and forcing stdout/stderr to be unbuffered
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies for Playwright and fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget gnupg ca-certificates curl unzip \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libdbus-1-3 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2 libatspi2.0-0 libxshmfence1 \
    libxfixes3 libxext6 libx11-6 libglib2.0-0 libjpeg62-turbo \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy only requirements first (better build caching)
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Install Playwright browsers (Chromium) and its OS deps
RUN python -m playwright install --with-deps chromium

# Copy the backend app code
COPY backend /app

# Expose Render's PORT
ENV PORT=10000
ENV PYTHONPATH=/app

# Use gunicorn to serve Flask (bind to 0.0.0.0:$PORT)
# If your Flask app file is named flasks.py with a variable `app`, WSGI path is flasks:app
CMD exec gunicorn --bind 0.0.0.0:${PORT} --workers 2 --threads 4 --timeout 120 flasks:app
