# CollegeGPT - AI-Powered Educational Assistant

A full-stack RAG (Retrieval-Augmented Generation) chatbot application designed for educational purposes. The system combines document ingestion, vector search, and AI-powered responses to provide intelligent assistance for college-related queries.

## 🚀 Features

- **Document Processing**: Supports PDF, PowerPoint, and image file ingestion
- **Vector Search**: Powered by AstraDB for efficient document retrieval
- **AI Responses**: Uses Google's Generative AI for contextual answers
- **Authentication**: Secure user authentication with Clerk
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Real-time Chat**: Interactive chat interface with message history

## 🏗️ Architecture

### Backend (FastAPI)

- **FastAPI**: High-performance Python web framework
- **LangChain**: Framework for building AI applications
- **AstraDB**: Vector database for document embeddings
- **Google Generative AI**: Embedding and chat models
- **Clerk Authentication**: JWT-based user authentication

### Frontend (Next.js)

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Clerk**: User authentication and management
- **Radix UI**: Accessible UI components

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- AstraDB account
- Google AI Studio API key
- Clerk account (for authentication)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CollegeGptt.git
cd CollegeGptt
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

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

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend**:

```bash
cd backend
# Activate virtual environment first
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

2. **Start the Frontend**:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Mode

Set `ENVIRONMENT=production` in your backend `.env` file and ensure all required environment variables are configured.

## 📚 API Endpoints

### Chat

- `POST /chat` - Send a message and get AI response

### Document Management

- `POST /ingest` - Upload and process documents
- `GET /health` - Health check endpoint

### Authentication

- Uses Clerk JWT tokens for secure API access
- Development mode allows testing without authentication

## 🔒 Security Features

- JWT-based authentication with Clerk
- CORS configuration for cross-origin requests
- Environment-based configuration (development/production)
- Secure token verification in production

## 🧪 Development Features

- **Development Mode**: Runs without requiring authentication setup
- **Hot Reload**: Both frontend and backend support hot reloading
- **Type Safety**: Full TypeScript support in frontend
- **API Documentation**: Auto-generated docs with FastAPI

## 📱 Usage

1. **Sign Up/Sign In**: Create an account or log in using Clerk authentication
2. **Upload Documents**: Use the ingestion endpoint to upload educational materials
3. **Ask Questions**: Chat with the AI about your uploaded documents
4. **Get Contextual Answers**: Receive AI-powered responses based on your document content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/CollegeGptt/issues) page
2. Create a new issue with detailed information
3. Refer to the API documentation at `/docs` when the backend is running

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for the RAG framework
- [AstraDB](https://astra.datastax.com/) for vector database
- [Google AI](https://ai.google.dev/) for generative AI models
- [Clerk](https://clerk.dev/) for authentication
- [Vercel](https://vercel.com/) for frontend deployment options
