import os
from dotenv import load_dotenv

# Load environment variables FIRST before any other imports
load_dotenv()

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
        # Local development
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        
        # Your specific Vercel deployments
        
        # Add more Vercel deployment URLs as needed
        # You can add new ones here when you get new deployment URLs
        
        # Production domains (add your custom domain here if you have one)
        "https://collegegpt.vercel.app",
        "https://www.collegegpt.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language", 
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ],
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

# Initialize the vector store and retriever with better search parameters
try:
    vector_store = get_vector_store()
    # Retrieve more documents for better context, with similarity threshold
    retriever = vector_store.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            "k": 5,  # Get top 5 relevant documents instead of 3
            "score_threshold": 0.5  # Only include reasonably relevant results
        }
    )
    print("Astra DB connection successful.")
except Exception as e:
    print(f"Failed to connect to Astra DB: {e}")
    # Fallback to basic retriever if similarity_score_threshold isn't supported
    try:
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})
        print("Astra DB connection successful with basic retriever.")
    except Exception as e2:
        print(f"Failed to connect to Astra DB with fallback: {e2}")
        vector_store = None
        retriever = None

# Initialize the LLM with better settings for educational content
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro", 
    temperature=0.3,  # Slightly more creative while staying factual
    max_tokens=1000,  # Allow longer responses
    top_p=0.9,       # Better diversity in responses
)

# Define the prompt template for educational assistance
prompt_template = """
You are CollegeGPT, a helpful educational assistant specializing in college and academic topics. 
Your goal is to provide clear, informative, and educational responses to help students learn.

Use the following context to answer the question. If the context contains relevant information, 
explain it clearly and provide helpful details. If you can only find partial information, 
explain what you know and suggest what additional information might be helpful.

If the context doesn't contain enough information to answer the question, politely explain 
what you cannot answer and suggest related topics you might be able to help with instead.

Context:
{context}

Question:
{question}

Please provide a helpful, educational response:
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
    return {"status": "API is running", "timestamp": "2025-08-06", "version": "1.0.1", "deployment": "fresh"}

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
        # Create a personalized prompt with better context
        if current_user:
            user_name = request.user_name or current_user.get('given_name', 'there')
            user_context = f"The user's name is {user_name}. Address them personally. "
            print(f"Authenticated user: {user_name}")
        else:
            user_context = ""
        
        # Enhanced question with user context
        if user_context:
            personalized_question = f"{user_context}Question: {request.question}"
        else:
            personalized_question = request.question
            
        print(f"Processing question: {personalized_question}")
        
        # Get the answer from the RAG chain
        answer = chain.invoke(personalized_question)
        
        # Clean up the answer and add personalization
        if current_user and request.user_name and not answer.startswith("Hello"):
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
