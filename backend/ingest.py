import os
import tempfile
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredPowerPointLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_astradb import AstraDBVectorStore
import pytesseract

# You may need to install the tesseract OCR engine on your system
# For macOS: brew install tesseract
# For Ubuntu: sudo apt-get install tesseract-ocr
# For Windows, you can download from here: https://github.com/UB-Mannheim/tesseract/wiki

# --- ENVIRONMENT SETUP ---
# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---
# Azure Blob Storage configuration
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME", "college-data")
# Name for the collection in Astra DB
ASTRA_DB_COLLECTION_NAME = "rag_chatbot_collection"

# --- DOCUMENT PROCESSING ---

def load_documents_from_azure():
    """
    Loads documents from Azure Blob Storage, processing different file types.
    Currently supports .pdf, .pptx, .txt, and image files for OCR.
    """
    documents = []
    print(f"Loading documents from Azure Blob Storage container: {AZURE_CONTAINER_NAME}...")
    
    try:
        # Initialize the Azure Blob Service Client
        if not AZURE_STORAGE_CONNECTION_STRING:
            raise ValueError("Azure Storage connection string not provided")
            
        blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
        container_client = blob_service_client.get_container_client(AZURE_CONTAINER_NAME)
        
        # List all blobs in the container
        blob_list = container_client.list_blobs()
        
        for blob in blob_list:
            try:
                print(f"Processing: {blob.name}")
                
                # Download blob content
                blob_client = blob_service_client.get_blob_client(
                    container=AZURE_CONTAINER_NAME, 
                    blob=blob.name
                )
                blob_data = blob_client.download_blob().readall()
                
                # Create a temporary file to process the blob
                with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(blob.name)[1]) as temp_file:
                    temp_file.write(blob_data)
                    temp_file_path = temp_file.name
                
                try:
                    # Process based on file extension
                    if blob.name.endswith(".pdf"):
                        loader = PyPDFLoader(temp_file_path)
                        documents.extend(loader.load())
                        print(f"  - Loaded {blob.name} (PDF)")
                    elif blob.name.endswith(".pptx"):
                        loader = UnstructuredPowerPointLoader(temp_file_path)
                        documents.extend(loader.load())
                        print(f"  - Loaded {blob.name} (PowerPoint)")
                    elif blob.name.endswith(".txt"):
                        loader = TextLoader(temp_file_path, encoding='utf-8')
                        documents.extend(loader.load())
                        print(f"  - Loaded {blob.name} (Text)")
                    elif blob.name.lower().endswith(('.png', '.jpg', '.jpeg')):
                        from PIL import Image
                        from langchain_core.documents import Document

                        text = pytesseract.image_to_string(Image.open(temp_file_path))
                        if text.strip():  # Only add if OCR found text
                            doc = Document(page_content=text, metadata={"source": blob.name})
                            documents.append(doc)
                            print(f"  - Loaded and OCR'd {blob.name} (Image)")
                
                finally:
                    # Clean up temporary file
                    os.unlink(temp_file_path)
                    
            except Exception as e:
                print(f"Error processing {blob.name}: {e}")
                continue
        
    except Exception as e:
        print(f"Error connecting to Azure Blob Storage: {e}")
        return []
    
    print(f"\nTotal documents loaded: {len(documents)}")
    return documents

def split_text(documents):
    """
    Splits the loaded documents into smaller chunks for processing.
    """
    print("\nSplitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=150
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Total chunks created: {len(chunks)}")
    return chunks

# --- VECTORIZATION AND STORAGE ---

def create_vector_store(chunks):
    """
    Embeds the text chunks and stores them in a cloud-based Astra DB vector store.
    """
    print("\nCreating and storing in Astra DB vector store...")
    
    # Initialize the embedding model from Google
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    # Initialize the Astra DB vector store
    vstore = AstraDBVectorStore(
        embedding=embeddings,
        collection_name=ASTRA_DB_COLLECTION_NAME,
        api_endpoint=os.getenv("ASTRA_DB_API_ENDPOINT"),
        token=os.getenv("ASTRA_DB_APPLICATION_TOKEN"),
    )
    
    # Add the document chunks to the vector store
    # This will embed the chunks and upload them to your cloud database
    inserted_ids = vstore.add_documents(chunks)
    print(f"\nSuccessfully inserted {len(inserted_ids)} documents into Astra DB.")
    
    return vstore


# --- MAIN EXECUTION ---

if __name__ == "__main__":
    print("--- Starting Data Ingestion Pipeline ---")
    
    # Check if Azure connection string is configured
    if not AZURE_STORAGE_CONNECTION_STRING:
        print("Error: AZURE_STORAGE_CONNECTION_STRING not found in environment variables.")
        print("Please set this in your .env file.")
        exit(1)
    
    # 1. Load documents from Azure Blob Storage
    docs = load_documents_from_azure()
    
    if not docs:
        print("No documents found in Azure Blob Storage. Exiting.")
    else:
        # 2. Split documents into manageable chunks
        doc_chunks = split_text(docs)
        
        # 3. Create and save the vector store in the cloud
        create_vector_store(doc_chunks)
        
        print("\n--- Data Ingestion Pipeline Complete ---")
