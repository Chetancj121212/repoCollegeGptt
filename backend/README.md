# Backend - CollegeGPT API

This is the FastAPI backend for the CollegeGPT application, providing a RAG (Retrieval-Augmented Generation) chatbot API with document ingestion and AI-powered responses.

## 🏗️ Architecture

- **FastAPI**: High-performance Python web framework
- **LangChain**: Framework for building LLM applications
- **AstraDB**: Vector database for document embeddings
- **Google Generative AI**: Embedding and chat models
- **Clerk**: JWT-based authentication

## 📋 Requirements

- Python 3.8+
- Virtual environment (recommended)
- AstraDB account
- Google AI Studio API key

## 🚀 Quick Start

### 1. Setup Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file:

```env
# Development/Production Mode
ENVIRONMENT=development

# Google AI
GOOGLE_API_KEY=your_google_api_key

# AstraDB Configuration
ASTRA_DB_API_ENDPOINT=your_astra_db_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
ASTRA_DB_COLLECTION_NAME=rag_chatbot_collection

# Clerk Authentication (required for production)
CLERK_SECRET_KEY=your_clerk_secret_key

# Azure Blob Storage (optional)
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
AZURE_CONTAINER_NAME=your_container_name
```

### 4. Run the Server

```bash
# Development mode
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📚 API Endpoints

### Health Check

- `GET /` - Basic health check
- `GET /health` - Detailed health status

### Chat

- `POST /chat` - Send message and get AI response
  ```json
  {
    "message": "What is machine learning?",
    "conversation_id": "optional-conversation-id"
  }
  ```

### Document Ingestion

- `POST /ingest` - Upload and process documents
  - Supports: PDF, PowerPoint, Images
  - Automatically extracts text and creates embeddings

## 🔒 Authentication

### Development Mode

Set `ENVIRONMENT=development` to run without authentication requirements. The system will use mock users for testing.

### Production Mode

- Requires `CLERK_SECRET_KEY` environment variable
- All endpoints require valid JWT tokens
- Tokens are verified against Clerk's JWKS

## 🛠️ Development

### Project Structure

```
backend/
├── main.py              # FastAPI application
├── clerk_auth.py        # Authentication middleware
├── ingest.py           # Document ingestion logic
├── requirements.txt    # Python dependencies
└── .env               # Environment variables
```

### Key Components

#### `main.py`

- FastAPI application setup
- Chat endpoint implementation
- Vector store integration
- CORS configuration

#### `clerk_auth.py`

- JWT token verification
- Development/production mode handling
- User authentication dependencies

#### `ingest.py`

- Document processing pipeline
- Text extraction from various formats
- Vector embedding generation

### Adding New Features

1. **New Endpoints**: Add to `main.py`
2. **Authentication**: Use `get_current_user_required` or `get_current_user_optional`
3. **Document Types**: Extend `ingest.py` with new processors

## 🧪 Testing

### Manual Testing

Visit `http://localhost:8000/docs` for interactive API documentation.

### Development Mode Testing

```bash
# Set development mode
export ENVIRONMENT=development  # Linux/macOS
$env:ENVIRONMENT="development"  # Windows PowerShell

uvicorn main:app --reload
```

## 📦 Dependencies

### Core Dependencies

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `langchain`: LLM framework
- `langchain-google-genai`: Google AI integration
- `langchain-astradb`: Vector database

### Authentication

- `pyjwt`: JWT token handling
- `cryptography`: JWT verification
- `requests`: HTTP client

### Document Processing

- `python-pptx`: PowerPoint processing
- `pytesseract`: OCR for images
- `pillow`: Image processing

## 🚀 Deployment

### Environment Variables for Production

```env
ENVIRONMENT=production
GOOGLE_API_KEY=your_production_key
ASTRA_DB_API_ENDPOINT=your_production_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_production_token
CLERK_SECRET_KEY=your_production_clerk_key
```

### Docker (Optional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 Configuration Options

### Vector Store Settings

- Collection name can be customized via `ASTRA_DB_COLLECTION_NAME`
- Embedding model: `models/embedding-001` (Google)

### AI Model Settings

- Chat model: `gemini-1.5-flash` (Google)
- Temperature: 0.3 (configurable in code)

## 🐛 Troubleshooting

### Common Issues

1. **"CLERK_SECRET_KEY required"**

   - Set `ENVIRONMENT=development` for local development
   - Or add your Clerk secret key to `.env`

2. **"Vector store connection failed"**

   - Verify AstraDB credentials
   - Check network connectivity

3. **"Google AI API error"**
   - Verify `GOOGLE_API_KEY` is valid
   - Check API quotas and billing

### Debug Mode

Set FastAPI debug mode:

```python
app = FastAPI(debug=True)
```

## 📈 Performance Tips

1. **Vector Store**: Use appropriate chunk sizes for documents
2. **Embeddings**: Batch process documents when possible
3. **Caching**: Consider adding response caching for common queries
4. **Database**: Monitor AstraDB usage and optimize queries

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to new functions
3. Update `requirements.txt` for new dependencies
4. Test both development and production modes
