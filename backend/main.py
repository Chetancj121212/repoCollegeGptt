import os
import warnings
from dotenv import load_dotenv

# Load environment variables FIRST before any other imports
load_dotenv()

# Suppress specific HuggingFace deprecation warnings
warnings.filterwarnings("ignore", message=".*encoder_attention_mask.*", category=FutureWarning)

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_astradb import AstraDBVectorStore
from clerk_auth import get_current_user_optional
from typing import Optional

# --- ENVIRONMENT AND APP SETUP ---

# Initialize FastAPI app
app = FastAPI(
    title="RAG Chatbot API",
    description="An API for a Retrieval-Augmented Generation chatbot.",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# This allows your frontend (running on a different domain/port) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # For local development
        "https://collegegptfrontend-rgk5ca68m-chetan-jharbades-projects.vercel.app",  # Your current Vercel URL
        "https://collegegptfrontend-*.vercel.app",  # Allow all your Vercel deployments
        "https://*.vercel.app",   # Allow all Vercel deployments
        "https://*.netlify.app",  # Allow all Netlify deployments
        "https://*.onrender.com", # Allow all Render deployments
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Added more methods
    allow_headers=["*"],
)

# --- ASTRA DB AND LANGCHAIN SETUP ---

def get_vector_store():
    """Initializes and returns an AstraDBVectorStore instance."""
    # Initialize the Google Generative AI embedding model
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001"  # Gemini embedding model - uses GOOGLE_API_KEY from environment
    )
    
    # Initialize the Astra DB vector store
    vstore = AstraDBVectorStore(
        embedding=embeddings,
        collection_name=os.getenv("ASTRA_DB_COLLECTION_NAME", "rag_chatbot_collection"),
        api_endpoint=os.getenv("ASTRA_DB_API_ENDPOINT"),
        token=os.getenv("ASTRA_DB_APPLICATION_TOKEN"),
    )
    return vstore

# Initialize the vector store and retriever
try:
    vector_store = get_vector_store()
    retriever = vector_store.as_retriever(search_kwargs={"k": 3}) # Retrieve top 3 relevant documents
    print("Astra DB connection successful.")
except Exception as e:
    print(f"Failed to connect to Astra DB: {e}")
    vector_store = None
    retriever = None

# Initialize the LLM
llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.1,)

# Define the prompt template
prompt_template = """
You are a helpful assistant. Answer the question based only on the following context.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context:
{context}

Question:
{question}
"""
prompt = ChatPromptTemplate.from_template(prompt_template)

# Create the RAG chain using LangChain Expression Language (LCEL)
# Only create the chain if retriever is available
chain = None
if retriever:
    chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

# --- API ENDPOINTS ---

# Pydantic model for the request body
class ChatRequest(BaseModel):
    question: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None

@app.get("/")
def read_root():
    """A simple endpoint to check if the API is running."""
    return {"status": "API is running", "timestamp": "2025-08-06", "embeddings": "Hugging Face"}

@app.get("/health")
def health_check():
    """Health check endpoint with more details."""
    return {
        "status": "healthy",
        "vector_store_initialized": vector_store is not None,
        "retriever_initialized": retriever is not None,
        "chain_initialized": chain is not None,
        "embedding_model": "models/embedding-001"
    }

@app.options("/api/chat")
async def chat_options():
    """Handle OPTIONS preflight request for CORS"""
    return {"message": "OK"}

@app.post("/api/chat")
async def chat(request: ChatRequest, current_user: Optional[dict] = Depends(get_current_user_optional)):
    """
    Handles chat requests. Receives a question, uses the RAG chain to generate an answer,
    and returns the answer. Now supports authenticated users.
    """
    print(f"Received chat request: {request.question}")  # Debug logging
    
    if not retriever or not chain:
        error_msg = "Vector store or chain is not initialized. Please check your API keys and Astra DB connection."
        print(f"Error: {error_msg}")
        return {"error": error_msg}
    
    try:
        # Enhance the prompt with user context if authenticated
        user_context = ""
        if current_user:
            user_name = request.user_name or current_user.get('given_name', 'there')
            user_context = f"The user's name is {user_name}. "
            print(f"Authenticated user: {user_name}")
        
        # Create a personalized prompt
        personalized_question = f"{user_context}Question: {request.question}"
        print(f"Processing question: {personalized_question}")
        
        # Get the answer from the RAG chain
        answer = chain.invoke(personalized_question)
        
        # Add a personalized greeting if this is the first interaction
        if current_user and request.user_name:
            answer = f"Hello {request.user_name}! {answer}"
        
        return {
            "answer": answer,
            "authenticated": current_user is not None,
            "user_id": current_user.get('sub') if current_user else None
        }
    except Exception as e:
        return {"error": f"An error occurred: {e}"}

@app.post("/api/refresh-data")
async def refresh_data_from_azure(current_user: Optional[dict] = Depends(get_current_user_optional)):
    """
    Endpoint to trigger data refresh from Azure Blob Storage.
    This will re-ingest all documents from your Azure Blob Storage container.
    Note: This is a time-consuming operation and should be used sparingly.
    """
    try:
        # Import the ingestion functions
        from ingest import load_documents_from_azure, split_text, create_vector_store
        
        # Load documents from Azure Blob Storage
        print("Loading documents from Azure Blob Storage...")
        docs = load_documents_from_azure()
        
        if not docs:
            return {"error": "No documents found in Azure Blob Storage"}
        
        # Split documents into chunks
        print("Splitting documents into chunks...")
        doc_chunks = split_text(docs)
        
        # Update vector store
        print("Updating vector store...")
        create_vector_store(doc_chunks)
        
        # Reinitialize the retriever with updated data
        global retriever, chain
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})
        
        # Recreate the chain with the new retriever
        if retriever:
            chain = (
                {"context": retriever, "question": RunnablePassthrough()}
                | prompt
                | llm
                | StrOutputParser()
            )
        
        return {
            "message": "Data refresh completed successfully",
            "documents_processed": len(docs),
            "chunks_created": len(doc_chunks)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data refresh failed: {e}")

# To run this app:
# 1. Make sure your virtual environment is activated.
# 2. In your terminal, run: uvicorn main:app --reload
