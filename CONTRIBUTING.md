# Contributing to CollegeGPT

Thank you for your interest in contributing to CollegeGPT! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- Git
- AstraDB account
- Google AI Studio API key
- Clerk account

### Setting Up Development Environment

1. **Fork and Clone**

   ```bash
   git clone https://github.com/yourusername/CollegeGptt.git
   cd CollegeGptt
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate

   pip install -r requirements.txt
   cp .env.example .env
   # Fill in your environment variables
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Fill in your environment variables
   ```

## 🛠️ Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:

```
feat(chat): add message history functionality

Implement message persistence and retrieval for chat interface.
Users can now view previous conversations.

Closes #123
```

## 📝 Code Style Guidelines

### Python (Backend)

- Follow PEP 8
- Use type hints
- Maximum line length: 88 characters
- Use docstrings for functions and classes

```python
def process_document(file_path: str, user_id: str) -> Dict[str, Any]:
    """
    Process a document and extract text content.

    Args:
        file_path: Path to the document file
        user_id: ID of the user uploading the document

    Returns:
        Dictionary containing processed document metadata
    """
    # Implementation here
    pass
```

### TypeScript/React (Frontend)

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Consistent naming conventions

```typescript
interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  userId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ messages }) => {
  // Implementation here
};
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
# Run tests (when available)
pytest tests/

# Type checking
mypy .

# Linting
flake8 .
```

### Frontend Testing

```bash
cd frontend
# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📋 Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Write clean, documented code
   - Follow established patterns
   - Add tests for new functionality

3. **Test Your Changes**

   - Ensure all tests pass
   - Test in development environment
   - Verify both frontend and backend work together

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create pull request on GitHub
   - Fill out PR template
   - Link related issues

### PR Requirements

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or properly documented)
- [ ] PR description explains changes clearly

## 🐛 Bug Reports

### Before Reporting

- Check existing issues
- Try latest version
- Verify it's not a configuration issue

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Environment**

- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 95]
- Backend Version: [e.g., 1.0.0]
- Frontend Version: [e.g., 1.0.0]

**Additional Context**
Screenshots, logs, etc.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Screenshots, mockups, etc.
```

## 🏗️ Architecture Guidelines

### Backend Architecture

- Follow FastAPI best practices
- Use dependency injection
- Separate concerns (auth, business logic, data access)
- Handle errors gracefully

### Frontend Architecture

- Use Next.js App Router
- Keep components small and focused
- Use custom hooks for logic
- Implement proper error boundaries

### Database

- Use AstraDB for vector storage
- Design efficient queries
- Handle connection errors

## 📚 Documentation

### Code Documentation

- Document public APIs
- Include usage examples
- Keep documentation current

### README Updates

- Update setup instructions
- Add new features to feature list
- Update troubleshooting section

## 🔒 Security Guidelines

### Authentication

- Never commit API keys or secrets
- Use environment variables
- Validate all user inputs
- Implement proper error handling

### Data Handling

- Validate file uploads
- Sanitize user inputs
- Handle sensitive data appropriately

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers
- Focus on the best solution

### Communication

- Use clear, professional language
- Be patient with questions
- Share knowledge and resources
- Collaborate effectively

## 📞 Getting Help

- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Documentation**: Check README files first
- **Code Review**: Request reviews on PRs

## 🎉 Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to CollegeGPT! 🚀
