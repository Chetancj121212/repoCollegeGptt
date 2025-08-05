# Azure Blob Storage Setup Guide

This guide will help you set up Azure Blob Storage to store your college data documents instead of using local files.

## Prerequisites

1. Azure account (you can create a free account at https://azure.microsoft.com/free/)
2. Azure Storage Account

## Step 1: Create Azure Storage Account

1. Go to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Storage account" and select it
4. Click "Create"
5. Fill in the required information:
   - **Subscription**: Select your subscription
   - **Resource group**: Create new or select existing
   - **Storage account name**: Choose a unique name (e.g., "collegedata123")
   - **Region**: Choose a region close to you
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally Redundant Storage) is fine for development
6. Click "Review + create" then "Create"

## Step 2: Create a Container

1. Once your storage account is created, go to it
2. In the left menu, click "Containers" under "Data storage"
3. Click "+ Container"
4. Name your container (e.g., "college-data")
5. Set "Public access level" to "Private (no anonymous access)"
6. Click "Create"

## Step 3: Upload Your Documents

1. Click on your newly created container
2. Click "Upload"
3. Select your files (.pdf, .txt, .pptx, images)
4. Click "Upload"

## Step 4: Get Connection String

1. In your storage account, go to "Access keys" under "Security + networking"
2. Click "Show keys"
3. Copy the "Connection string" from key1 or key2

## Step 5: Update Your .env File

Add the following to your `backend/.env` file:

```env
# Azure Blob Storage Configuration
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=your_account_name;AccountKey=your_account_key;EndpointSuffix=core.windows.net"
AZURE_CONTAINER_NAME="college-data"
```

Replace the connection string with the one you copied from step 4.

## Step 6: Test the Setup

1. Make sure your documents are uploaded to your Azure Blob Storage container
2. Update your `.env` file with the correct connection string and container name
3. Run the ingestion script:
   ```bash
   cd backend
   python ingest.py
   ```

## Features of Azure Integration

### ✅ **What's Implemented:**

1. **Document Loading**: Automatically loads all supported files from your Azure Blob Storage container
2. **File Type Support**:
   - PDF files (.pdf)
   - PowerPoint presentations (.pptx)
   - Text files (.txt)
   - Images (.png, .jpg, .jpeg) with OCR
3. **Automatic Processing**: Downloads files temporarily, processes them, then cleans up
4. **Error Handling**: Graceful handling of connection issues and file processing errors
5. **Data Refresh API**: New endpoint `/api/refresh-data` to re-ingest data without restarting the server

### 🔄 **Data Refresh Endpoint:**

You can now refresh your data without restarting the server by making a POST request to:

```
POST http://localhost:8000/api/refresh-data
```

This will:

- Load all documents from your Azure Blob Storage
- Process and chunk them
- Update your vector store
- Refresh the retriever with new data

## Benefits of Azure Blob Storage

1. **Scalability**: Store unlimited documents
2. **Accessibility**: Access from anywhere
3. **Security**: Enterprise-grade security
4. **Cost-effective**: Pay only for what you use
5. **Integration**: Easy integration with other Azure services
6. **Backup**: Built-in redundancy and backup options

## Troubleshooting

### Common Issues:

1. **Connection String Error**: Make sure your connection string is correct and properly formatted
2. **Container Not Found**: Verify the container name matches exactly
3. **Access Denied**: Check that your access keys are valid
4. **No Documents Found**: Ensure files are uploaded to the correct container

### Testing Connection:

You can test your Azure connection by running:

```bash
cd backend
python -c "
from azure.storage.blob import BlobServiceClient
import os
from dotenv import load_dotenv
load_dotenv()
conn_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
container = os.getenv('AZURE_CONTAINER_NAME')
client = BlobServiceClient.from_connection_string(conn_str)
blobs = list(client.get_container_client(container).list_blobs())
print(f'Found {len(blobs)} files in container {container}')
for blob in blobs:
    print(f'  - {blob.name}')
"
```

## Next Steps

Once you have Azure Blob Storage set up:

1. Upload your college-related documents to the container
2. Run `python ingest.py` to process and store them
3. Start your FastAPI server: `uvicorn main:app --reload`
4. Your chatbot will now use data from Azure Blob Storage!

## Security Notes

- Never commit your connection string to version control
- Use environment variables for all sensitive information
- Consider using Azure Key Vault for production environments
- Regularly rotate your access keys
