# eQuization API Collection

Complete API endpoint reference with example requests and responses.

## 🔐 Authentication

### Register New User
```bash
POST /api/v1/auth/register

Request:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "isVerified": false
    }
  }
}
```

### Login
```bash
POST /api/v1/auth/login

Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://...",
      "isVerified": true,
      "role": "user"
    }
  }
}
```

## 📝 Quiz Management

### Create Quiz
```bash
POST /api/v1/quizzes
Authorization: Bearer {token}

Request:
{
  "title": "General Knowledge Quiz",
  "description": "Test your knowledge with 10 interesting questions covering various topics",
  "detailedDescription": "This comprehensive quiz covers history, science, geography, and more...",
  "categories": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "difficulty": "medium",
  "educationLevel": "general",
  "isPublic": true,
  "timeLimit": 30,
  "pointsPerQuestion": 100,
  "settings": {
    "showAnswers": true,
    "randomizeQuestions": false,
    "randomizeAnswers": true,
    "allowMultipleTakes": true
  },
  "tags": ["general", "knowledge", "fun"],
  "language": "en"
}

Response (201):
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "quiz": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "General Knowledge Quiz",
      "description": "Test your knowledge...",
      "quizCode": "ABC123",
      "creator": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "avatar": "https://..."
      },
      "categories": [...],
      "questionCount": 0,
      "statistics": {
        "totalPlays": 0,
        "totalPlayers": 0,
        "averageScore": 0,
        "views": 0
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get All Quizzes (with filters)
```bash
GET /api/v1/quizzes?page=1&limit=12&category=507f1f77bcf86cd799439011&difficulty=medium&search=science

Response (200):
{
  "success": true,
  "message": "Quizzes retrieved successfully",
  "data": [
    {
      "_id": "...",
      "title": "Science Quiz",
      "description": "...",
      "coverImage": "https://...",
      "categories": [...],
      "creator": {...},
      "questionCount": 10,
      "statistics": {...}
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "pages": 4
  }
}
```

## ❓ Question Management

### Add Question to Quiz
```bash
POST /api/v1/questions
Authorization: Bearer {token}

Request:
{
  "quiz": "507f1f77bcf86cd799439013",
  "questionText": "What is the capital of France?",
  "questionType": "multiple-choice",
  "answers": [
    {
      "text": "London",
      "isCorrect": false
    },
    {
      "text": "Paris",
      "isCorrect": true
    },
    {
      "text": "Berlin",
      "isCorrect": false
    },
    {
      "text": "Madrid",
      "isCorrect": false
    }
  ],
  "points": 100,
  "timeLimit": 30,
  "explanation": "Paris is the capital and largest city of France.",
  "difficulty": "easy"
}

Response (201):
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "question": {
      "_id": "507f1f77bcf86cd799439014",
      "quiz": "507f1f77bcf86cd799439013",
      "questionText": "What is the capital of France?",
      "questionType": "multiple-choice",
      "answers": [...],
      "points": 100,
      "timeLimit": 30,
      "difficulty": "easy",
      "order": 0
    }
  }
}
```

### Bulk Create Questions
```bash
POST /api/v1/questions/bulk
Authorization: Bearer {token}

Request:
{
  "quizId": "507f1f77bcf86cd799439013",
  "questions": [
    {
      "questionText": "Question 1?",
      "questionType": "multiple-choice",
      "answers": [...]
    },
    {
      "questionText": "Question 2?",
      "questionType": "true-false",
      "answers": [...]
    }
  ]
}

Response (201):
{
  "success": true,
  "message": "Questions created successfully",
  "data": {
    "questions": [...],
    "count": 2
  }
}
```

## 🎮 Play Quiz (Individual Mode)

### Start Quiz
```bash
POST /api/v1/play/start

Request:
{
  "quizId": "507f1f77bcf86cd799439013",
  "playerName": "John Doe"
}

Response (200):
{
  "success": true,
  "message": "Quiz started successfully",
  "data": {
    "quiz": {
      "id": "507f1f77bcf86cd799439013",
      "title": "General Knowledge Quiz",
      "description": "...",
      "timeLimit": 30,
      "pointsPerQuestion": 100
    },
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "questionText": "What is the capital of France?",
        "questionType": "multiple-choice",
        "answers": [
          {
            "_id": "507f1f77bcf86cd799439015",
            "text": "London"
          },
          {
            "_id": "507f1f77bcf86cd799439016",
            "text": "Paris"
          }
        ],
        "timeLimit": 30,
        "points": 100
      }
    ],
    "totalQuestions": 10
  }
}
```

### Submit Answers
```bash
POST /api/v1/play/submit

Request:
{
  "quizId": "507f1f77bcf86cd799439013",
  "playerName": "John Doe",
  "timeSpent": 125000,
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439014",
      "selectedAnswers": ["507f1f77bcf86cd799439016"],
      "timeSpent": 5000
    },
    {
      "questionId": "507f1f77bcf86cd799439017",
      "selectedAnswers": ["507f1f77bcf86cd799439018"],
      "timeSpent": 3500
    }
  ]
}

Response (200):
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "result": {
      "score": 850,
      "correctAnswers": 9,
      "wrongAnswers": 1,
      "totalQuestions": 10,
      "accuracy": "90.00",
      "timeSpent": 125000,
      "rank": 5
    },
    "answers": [
      {
        "question": "507f1f77bcf86cd799439014",
        "selectedAnswers": ["507f1f77bcf86cd799439016"],
        "isCorrect": true,
        "timeSpent": 5000,
        "points": 95
      }
    ]
  }
}
```

## 🏆 Leaderboard

### Get Quiz Leaderboard
```bash
GET /api/v1/play/leaderboard/507f1f77bcf86cd799439013?limit=10

Response (200):
{
  "success": true,
  "message": "Leaderboard retrieved successfully",
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "playerName": "johndoe",
        "avatar": "https://...",
        "score": 950,
        "correctAnswers": 10,
        "totalQuestions": 10,
        "accuracy": "100.00",
        "timeSpent": 98500,
        "completedAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "rank": 2,
        "playerName": "Jane Smith",
        "score": 900,
        "correctAnswers": 9,
        "totalQuestions": 10,
        "accuracy": "90.00",
        "timeSpent": 105000,
        "completedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## 🎪 Host Live Session

### Create Game Session
```bash
POST /api/v1/host/create-session
Authorization: Bearer {token}

Request:
{
  "quizId": "507f1f77bcf86cd799439013",
  "settings": {
    "maxPlayers": 250,
    "allowLateJoin": false
  }
}

Response (201):
{
  "success": true,
  "message": "Game session created successfully",
  "data": {
    "session": {
      "_id": "507f1f77bcf86cd799439020",
      "sessionCode": "GAME123",
      "quiz": {...},
      "host": {...},
      "status": "waiting",
      "players": [],
      "settings": {
        "maxPlayers": 250,
        "allowLateJoin": false
      }
    }
  }
}
```

### Get Session Details
```bash
GET /api/v1/host/session/GAME123

Response (200):
{
  "success": true,
  "message": "Session retrieved successfully",
  "data": {
    "session": {
      "sessionCode": "GAME123",
      "quiz": {...},
      "host": {...},
      "status": "waiting",
      "playerCount": 5,
      "maxPlayers": 250
    }
  }
}
```

## 📊 Categories

### Get All Categories
```bash
GET /api/v1/categories

Response (200):
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": {
          "ar": "معلومات عامة",
          "en": "General Knowledge",
          "fr": "Culture Générale",
          "tr": "Genel Bilgi"
        },
        "slug": "general-knowledge",
        "icon": "mdi-brain",
        "color": "#FF6B6B",
        "quizCount": 45
      }
    ]
  }
}
```

## 👤 User Management

### Get User Profile
```bash
GET /api/v1/users/507f1f77bcf86cd799439011

Response (200):
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://...",
      "bio": "Quiz enthusiast and educator",
      "statistics": {
        "quizzesCreated": 15,
        "quizzesPlayed": 45,
        "totalScore": 42000
      },
      "quizzes": [...]
    }
  }
}
```

### Get User Statistics
```bash
GET /api/v1/users/me/statistics
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "statistics": {
      "quizzesCreated": 15,
      "quizzesPlayed": 45,
      "totalScore": 42000,
      "averageScore": 933.33,
      "averageAccuracy": 87.50,
      "recentPlays": [...]
    }
  }
}
```

## ⚡ Socket.IO Events

### Host Creates Session
```javascript
socket.emit('host:create-session', {
  quizId: '507f1f77bcf86cd799439013',
  hostId: '507f1f77bcf86cd799439011',
  settings: { maxPlayers: 250 }
}, (response) => {
  console.log('Session code:', response.session.sessionCode);
});
```

### Player Joins Session
```javascript
socket.emit('player:join-session', {
  sessionCode: 'GAME123',
  playerName: 'John Doe',
  userId: '507f1f77bcf86cd799439011' // optional
}, (response) => {
  if (response.success) {
    console.log('Joined successfully');
  }
});
```

### Host Starts Game
```javascript
socket.emit('host:start-game', {
  sessionCode: 'GAME123'
}, (response) => {
  console.log('Game started');
});
```

### Host Sends Question
```javascript
socket.emit('host:send-question', {
  sessionCode: 'GAME123',
  questionIndex: 0
}, (response) => {
  console.log('Question sent');
});
```

### Player Submits Answer
```javascript
socket.emit('player:submit-answer', {
  sessionCode: 'GAME123',
  questionIndex: 0,
  selectedAnswers: ['507f1f77bcf86cd799439016'],
  timeSpent: 5000
}, (response) => {
  console.log('Score:', response.totalScore);
});
```

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Quiz not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination starts at page 1
- Default limit is 12 items per page
- Maximum file upload size is 10MB
- Rate limiting: 100 requests per 15 minutes
- Auth rate limiting: 5 attempts per 15 minutes
- Email rate limiting: 3 emails per hour
