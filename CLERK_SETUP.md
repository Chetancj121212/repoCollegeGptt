# Clerk Authentication Setup Guide

## Step 1: Create Clerk Account and Application

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application:
   - Choose "Next.js" as your framework
   - Give your app a name (e.g., "CollegeGPT")
   - Choose your region

## Step 2: Configure Google OAuth

1. In your Clerk dashboard, go to "User & Authentication" > "Social Connections"
2. Enable Google OAuth
3. Configure Google OAuth settings (you may need to create a Google OAuth app)

## Step 3: Get Your API Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy your **Publishable key** and **Secret key**

## Step 4: Update Environment Variables

### Frontend (.env.local):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat
```

### Backend (.env):

```env
CLERK_SECRET_KEY=sk_test_your_secret_key_here
ENVIRONMENT=development
```

## Step 5: Test Your Application

1. Start your backend server:

   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Start your frontend server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Visit http://localhost:3000
4. Try signing up with Google
5. Navigate to the chat page (should be protected)

## Features Implemented

- ✅ Google OAuth authentication
- ✅ Protected chat route (requires login)
- ✅ User profile display in chat
- ✅ Personalized chat responses
- ✅ Sign in/Sign up pages with custom styling
- ✅ User context sent to backend
- ✅ Optional authentication (backend supports both authenticated and anonymous users)

## Free Tier Limitations

Clerk's free tier includes:

- Up to 10,000 monthly active users
- All authentication methods
- Basic user management
- Email support

## Next Steps

After setting up your Clerk keys:

1. Test the authentication flow
2. Customize the sign-in/sign-up appearance if needed
3. Add additional user profile fields
4. Implement chat history storage for authenticated users
5. Add user-specific features (favorites, preferences, etc.)

## Troubleshooting

- If authentication isn't working, check that your environment variables are correctly set
- Make sure your Clerk app is configured with the correct domain (localhost:3000 for development)
- Check the browser console for any authentication errors
- Verify that your backend is running on port 8000 and frontend on port 3000
