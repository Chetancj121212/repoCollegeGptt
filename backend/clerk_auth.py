import jwt
import requests
import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

security = HTTPBearer()

class ClerkAuth:
    def __init__(self):
        # Check for development mode first
        self.development_mode = os.getenv("ENVIRONMENT") == "development"
        self.clerk_secret_key = os.getenv("CLERK_SECRET_KEY")
        
        # Only require secret key in production
        if not self.development_mode and not self.clerk_secret_key:
            raise ValueError("CLERK_SECRET_KEY environment variable is required in production mode")
    
    async def verify_token(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
        """
        Verify Clerk JWT token and return user information
        """
        try:
            token = credentials.credentials
            
            # For development, we might want to skip verification
            # In production, always verify the token
            if self.development_mode:
                # In development, we can decode without verification for testing
                # WARNING: Never do this in production!
                try:
                    decoded = jwt.decode(token, options={"verify_signature": False})
                    return decoded
                except:
                    # If no valid token in development, return a mock user
                    return {"sub": "dev_user", "email": "dev@example.com", "name": "Development User"}
            
            # Production token verification
            if not self.clerk_secret_key:
                raise HTTPException(status_code=500, detail="Clerk configuration missing")
                
            # Get Clerk's JWKS (JSON Web Key Set)
            jwks_url = f"https://api.clerk.dev/v1/jwks"
            jwks_response = requests.get(jwks_url)
            jwks = jwks_response.json()
            
            # Verify and decode the token
            decoded = jwt.decode(
                token,
                key=jwks,
                algorithms=["RS256"],
                audience=self.clerk_secret_key
            )
            
            return decoded
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        except Exception as e:
            if self.development_mode:
                # In development, return mock user on any error
                return {"sub": "dev_user", "email": "dev@example.com", "name": "Development User"}
            raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# Initialize Clerk auth instance
clerk_auth = ClerkAuth()

# Dependency to get current user (optional - allows anonymous access)
async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    """
    Get current user if authenticated, None otherwise
    """
    if not credentials:
        return None
    
    try:
        return await clerk_auth.verify_token(credentials)
    except HTTPException:
        return None

# Dependency to require authentication
async def get_current_user_required(user: dict = Depends(clerk_auth.verify_token)) -> dict:
    """
    Require authentication - raises 401 if not authenticated
    """
    return user
