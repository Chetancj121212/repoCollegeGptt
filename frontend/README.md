# Frontend - CollegeGPT

A modern, responsive Next.js frontend for the CollegeGPT application. Built with TypeScript, Tailwind CSS, and Clerk authentication for a seamless user experience.

## 🚀 Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure user management with Clerk
- **Real-time Chat**: Interactive chat interface
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Works on desktop and mobile devices
- **Component Library**: Reusable UI components with Radix UI

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account for authentication

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Setup

Create a `.env.local` file in the frontend directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Authentication URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# API Configuration (optional)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── chat/            # Chat interface
│   │   ├── sign-in/         # Authentication pages
│   │   └── sign-up/
│   ├── components/          # Reusable components
│   │   └── ui/              # UI component library
│   ├── lib/                 # Utilities and configurations
│   └── middleware.ts        # Clerk middleware
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── next.config.ts           # Next.js configuration
└── package.json
```

## 🎨 UI Components

### Available Components

- **Avatar**: User profile pictures
- **Badge**: Status indicators
- **Button**: Interactive buttons with variants
- **Card**: Content containers
- **Input**: Form input fields
- **ScrollArea**: Scrollable content areas
- **Separator**: Visual dividers

### Component Usage

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 🔒 Authentication

The application uses Clerk for authentication with the following features:

- **Sign Up/Sign In**: Pre-built authentication forms
- **Protected Routes**: Automatic route protection
- **User Management**: Profile management and settings
- **Session Management**: Secure session handling

### Authentication Flow

1. Users access the application
2. Unauthenticated users are redirected to sign-in
3. After authentication, users can access the chat interface
4. JWT tokens are automatically managed by Clerk

## 📱 Pages and Features

### Home Page (`/`)

- Landing page with application overview
- Navigation to chat interface
- User authentication status

### Chat Interface (`/chat`)

- Real-time messaging interface
- Message history
- User-friendly chat bubbles
- Responsive design

### Authentication Pages

- **Sign In** (`/sign-in`): User login
- **Sign Up** (`/sign-up`): User registration
