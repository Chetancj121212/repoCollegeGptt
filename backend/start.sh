#!/bin/bash
# Render startup script

echo "Starting CollegeGPT Backend..."
echo "Python version: $(python --version)"

# Install dependencies
pip install -r requirements.txt

# Start the application
uvicorn main:app --host 0.0.0.0 --port $PORT
