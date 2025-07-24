# 📡 API Reference - Academico-AI

This document provides comprehensive API documentation for the Academico-AI backend services.

## 🔗 **Base URLs**

- **Production**: `https://your-backend-url.run.app`
- **Development**: `http://localhost:5001/your-project/us-central1/api`

## 🔐 **Authentication**

All API endpoints require authentication via Firebase Auth tokens.

### Authentication Header

```http
Authorization: Bearer <firebase_auth_token>
```

### Getting Auth Token (Frontend)

```typescript
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;
if (user) {
  const token = await user.getIdToken();
  // Use token in API requests
}
```

## 📚 **API Endpoints**

### 🏠 Health Check

#### GET `/`

Check if the API is running.

**Response:**

```json
{
  "message": "Firebase Cloud Function Express API is running!",
  "timestamp": "2025-01-22T10:30:00Z",
  "version": "1.0.0"
}
```

#### GET `/cors-test`

Test CORS configuration.

**Response:**

```json
{
  "message": "CORS is working!",
  "origin": "https://your-project.web.app",
  "timestamp": "2025-01-22T10:30:00Z"
}
```

---

### 👤 User Management

#### GET `/api/user/profile`

Get current user's profile information.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "uid": "user123",
    "email": "student@example.com",
    "displayName": "John Doe",
    "role": "student",
    "profile": {
      "gradeLevel": "10",
      "subjects": ["math", "science"],
      "learningStyle": "visual"
    },
    "createdAt": "2025-01-15T08:00:00Z",
    "lastLogin": "2025-01-22T10:30:00Z"
  }
}
```

#### PUT `/api/user/profile`

Update user profile information.

**Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "displayName": "John Doe",
  "profile": {
    "gradeLevel": "11",
    "subjects": ["math", "science", "history"],
    "learningStyle": "kinesthetic"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "uid": "user123",
    "displayName": "John Doe",
    "profile": {
      "gradeLevel": "11",
      "subjects": ["math", "science", "history"],
      "learningStyle": "kinesthetic"
    }
  }
}
```

---

### 💬 Chat Management

#### GET `/api/chats`

Get all chats for the authenticated user.

**Headers:**

```http
Authorization: Bearer <token>
```

**Query Parameters:**

- `limit` (optional): Number of chats to return (default: 20)
- `offset` (optional): Number of chats to skip (default: 0)
- `subject` (optional): Filter by subject

**Example Request:**

```http
GET /api/chats?limit=10&subject=math
```

**Response:**

```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "id": "chat123",
        "title": "Quadratic Equations Help",
        "subject": "math",
        "createdAt": "2025-01-20T14:30:00Z",
        "updatedAt": "2025-01-22T10:15:00Z",
        "messageCount": 8,
        "isActive": true
      }
    ],
    "total": 5,
    "hasMore": false
  }
}
```

#### POST `/api/chats`

Create a new chat conversation.

**Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Help with Calculus",
  "subject": "math",
  "initialMessage": "I'm struggling with derivatives. Can you help?"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "chatId": "chat456",
    "title": "Help with Calculus",
    "subject": "math",
    "createdAt": "2025-01-22T10:30:00Z",
    "messageId": "msg789",
    "aiResponse": "I'd be happy to help you with derivatives! Let's start with the basics..."
  }
}
```

#### GET `/api/chats/:chatId`

Get a specific chat with its message history.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "chat": {
      "id": "chat123",
      "title": "Quadratic Equations Help",
      "subject": "math",
      "createdAt": "2025-01-20T14:30:00Z",
      "updatedAt": "2025-01-22T10:15:00Z"
    },
    "messages": [
      {
        "id": "msg1",
        "role": "user",
        "content": "How do I solve x² + 5x + 6 = 0?",
        "timestamp": "2025-01-20T14:30:00Z"
      },
      {
        "id": "msg2",
        "role": "assistant",
        "content": "I'll help you solve this quadratic equation step by step...",
        "timestamp": "2025-01-20T14:30:15Z",
        "metadata": {
          "model": "gpt-4",
          "tokenCount": 150,
          "processingTime": 2.3
        }
      }
    ]
  }
}
```

#### DELETE `/api/chats/:chatId`

Delete a chat conversation.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

---

### 💌 Messages

#### POST `/api/chats/:chatId/messages`

Send a message in a chat conversation.

**Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "content": "Can you explain this step more clearly?",
  "context": {
    "previousMessages": 5,
    "subject": "math",
    "userLevel": "beginner"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "msg101",
      "role": "user",
      "content": "Can you explain this step more clearly?",
      "timestamp": "2025-01-22T10:30:00Z"
    },
    "aiResponse": {
      "id": "msg102",
      "role": "assistant",
      "content": "Of course! Let me break down that step in more detail...",
      "timestamp": "2025-01-22T10:30:15Z",
      "metadata": {
        "model": "gpt-4",
        "tokenCount": 120,
        "processingTime": 1.8
      }
    }
  }
}
```

#### GET `/api/chats/:chatId/messages`

Get messages for a specific chat.

**Headers:**

```http
Authorization: Bearer <token>
```

**Query Parameters:**

- `limit` (optional): Number of messages to return (default: 50)
- `before` (optional): Get messages before this timestamp
- `after` (optional): Get messages after this timestamp

**Response:**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg1",
        "role": "user",
        "content": "Help with quadratic equations",
        "timestamp": "2025-01-20T14:30:00Z"
      }
    ],
    "hasMore": false
  }
}
```

---

### 📊 Analytics

#### GET `/api/analytics/summary`

Get learning analytics summary for the user.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalChats": 15,
    "totalMessages": 120,
    "studyTime": {
      "thisWeek": 240,
      "thisMonth": 980,
      "total": 2400
    },
    "subjectBreakdown": {
      "math": 45,
      "science": 30,
      "english": 15,
      "history": 10
    },
    "progressTrends": {
      "daily": [5, 8, 3, 12, 7, 9, 15],
      "subjects": {
        "math": "improving",
        "science": "stable",
        "english": "needs_attention"
      }
    }
  }
}
```

---

## 🚨 **Error Responses**

### Error Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

### Common Error Codes

#### Authentication Errors

- **`UNAUTHORIZED`** (401): Invalid or missing auth token
- **`FORBIDDEN`** (403): Valid token but insufficient permissions
- **`TOKEN_EXPIRED`** (401): Auth token has expired

#### Validation Errors

- **`INVALID_REQUEST`** (400): Request body validation failed
- **`MISSING_REQUIRED_FIELD`** (400): Required field missing
- **`INVALID_CHAT_ID`** (400): Chat ID format invalid

#### Resource Errors

- **`CHAT_NOT_FOUND`** (404): Requested chat doesn't exist
- **`USER_NOT_FOUND`** (404): User profile not found
- **`MESSAGE_NOT_FOUND`** (404): Message doesn't exist

#### Server Errors

- **`INTERNAL_ERROR`** (500): Unexpected server error
- **`AI_SERVICE_UNAVAILABLE`** (503): AI service temporarily unavailable
- **`DATABASE_ERROR`** (500): Database operation failed

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "CHAT_NOT_FOUND",
    "message": "The requested chat conversation was not found",
    "details": "Chat ID 'invalid123' does not exist or you don't have permission to access it"
  }
}
```

---

## 📝 **Request/Response Examples**

### Complete Chat Flow Example

1. **Create a new chat:**

```bash
curl -X POST https://your-backend-url.run.app/api/chats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Physics Help",
    "subject": "science",
    "initialMessage": "What is Newton's first law?"
  }'
```

2. **Send follow-up message:**

```bash
curl -X POST https://your-backend-url.run.app/api/chats/chat123/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Can you give me a real-world example?"
  }'
```

3. **Get chat history:**

```bash
curl https://your-backend-url.run.app/api/chats/chat123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 **Rate Limiting**

### Current Limits

- **General API calls**: 100 requests per minute per user
- **Chat messages**: 20 messages per minute per user
- **User profile updates**: 10 requests per minute per user

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642857600
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": "Rate limit: 100 requests per minute"
  }
}
```

---

## 🧪 **Testing the API**

### Using curl

```bash
# Get auth token first (from frontend)
TOKEN="your_firebase_auth_token"

# Test basic connectivity
curl https://your-backend-url.run.app/

# Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" \
     https://your-backend-url.run.app/api/user/profile
```

### Using JavaScript/TypeScript

```typescript
const API_BASE = "https://your-backend-url.run.app";

class AcademicoAPI {
  constructor(private authToken: string) {}

  async getProfile() {
    const response = await fetch(`${API_BASE}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  async sendMessage(chatId: string, content: string) {
    const response = await fetch(`${API_BASE}/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  }
}
```

---

**Related Documentation**:

- 🔐 [Authentication Setup](../setup/FIREBASE_TEST_ACCOUNT_SETUP.md)
- 💻 [Frontend Integration](../developer/frontend-guide.md)
- 🧪 [Testing Guide](../troubleshooting/e2e-test-fixes.md)
- 🚀 [Deployment](../deployment/production-deploy.md)
