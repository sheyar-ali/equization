# eQuization Backend API

Complete Node.js backend for the eQuization interactive quiz platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with email verification
- **Quiz Management**: Full CRUD operations for quizzes and questions
- **Real-time Game Sessions**: Socket.IO powered live quiz hosting
- **Leaderboards & Statistics**: Track performance and rankings
- **Multi-language Support**: Arabic, English, French, Turkish
- **Category System**: Organized quiz categorization
- **Play Modes**: Individual and group quiz modes
- **User Profiles**: Complete user management and statistics

## 📋 Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB:
```bash
mongod
```

4. Run the server:

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Verify Email
```http
POST /auth/verify-email
Authorization: Bearer {token}
Content-Type: application/json

{
  "token": "123456"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "string"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "123456",
  "password": "string"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

#### Update User Details
```http
PUT /auth/update-details
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "string",
  "lastName": "string",
  "bio": "string"
}
```

#### Update Password
```http
PUT /auth/update-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Quiz Endpoints

#### Create Quiz
```http
POST /quizzes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "detailedDescription": "string",
  "categories": ["categoryId1", "categoryId2"],
  "difficulty": "easy|medium|hard",
  "educationLevel": "elementary|middle|high|university|professional|general",
  "isPublic": true,
  "timeLimit": 30,
  "pointsPerQuestion": 100,
  "settings": {
    "showAnswers": true,
    "randomizeQuestions": false,
    "randomizeAnswers": true,
    "allowMultipleTakes": true
  },
  "tags": ["tag1", "tag2"],
  "language": "ar|en|fr|tr"
}
```

#### Get All Quizzes
```http
GET /quizzes?page=1&limit=12&search=text&category=id&difficulty=easy&language=ar
```

#### Get Quiz by ID
```http
GET /quizzes/:id
```

#### Get Quiz by Code
```http
GET /quizzes/code/:code
```

#### Update Quiz
```http
PUT /quizzes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  ...
}
```

#### Delete Quiz
```http
DELETE /quizzes/:id
Authorization: Bearer {token}
```

#### Get My Quizzes
```http
GET /quizzes/user/my-quizzes?page=1&limit=12
Authorization: Bearer {token}
```

#### Get Featured Quizzes
```http
GET /quizzes/featured?limit=8
```

#### Duplicate Quiz
```http
POST /quizzes/:id/duplicate
Authorization: Bearer {token}
```

#### Get Quiz Statistics
```http
GET /quizzes/:id/statistics
Authorization: Bearer {token}
```

### Question Endpoints

#### Create Question
```http
POST /questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "quiz": "quizId",
  "questionText": "string",
  "questionImage": "url",
  "questionType": "multiple-choice|true-false|checkbox",
  "answers": [
    {
      "text": "string",
      "image": "url",
      "isCorrect": true
    }
  ],
  "points": 100,
  "timeLimit": 30,
  "explanation": "string",
  "difficulty": "easy|medium|hard",
  "order": 0
}
```

#### Get Quiz Questions
```http
GET /questions/quiz/:quizId
```

#### Get Question by ID
```http
GET /questions/:id
Authorization: Bearer {token}
```

#### Update Question
```http
PUT /questions/:id
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Question
```http
DELETE /questions/:id
Authorization: Bearer {token}
```

#### Bulk Create Questions
```http
POST /questions/bulk
Authorization: Bearer {token}
Content-Type: application/json

{
  "quizId": "string",
  "questions": [...]
}
```

#### Reorder Questions
```http
PUT /questions/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "quizId": "string",
  "questionOrders": [
    { "questionId": "id", "order": 0 }
  ]
}
```

### Category Endpoints

#### Get All Categories
```http
GET /categories
```

#### Get Category by ID/Slug
```http
GET /categories/:identifier
```

#### Get Popular Categories
```http
GET /categories/popular?limit=10
```

#### Create Category (Admin Only)
```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": {
    "ar": "string",
    "en": "string",
    "fr": "string",
    "tr": "string"
  },
  "slug": "string",
  "description": {...},
  "icon": "mdi-icon",
  "color": "#363999"
}
```

### Play Endpoints

#### Start Individual Quiz
```http
POST /play/start
Content-Type: application/json

{
  "quizId": "string",
  "playerName": "string"
}
```

#### Submit Quiz Answers
```http
POST /play/submit
Content-Type: application/json

{
  "quizId": "string",
  "playerName": "string",
  "timeSpent": 120000,
  "answers": [
    {
      "questionId": "string",
      "selectedAnswers": ["answerId"],
      "timeSpent": 5000
    }
  ]
}
```

#### Get Quiz Leaderboard
```http
GET /play/leaderboard/:quizId?limit=10&mode=all|individual|group
```

#### Get Play History
```http
GET /play/history?page=1&limit=10
Authorization: Bearer {token}
```

#### Get Quiz Result
```http
GET /play/result/:historyId
```

### Host Endpoints

#### Create Game Session
```http
POST /host/create-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "quizId": "string",
  "settings": {
    "maxPlayers": 250,
    "allowLateJoin": false
  }
}
```

#### Get Session Details
```http
GET /host/session/:sessionCode
```

#### Get Host's Sessions
```http
GET /host/my-sessions
Authorization: Bearer {token}
```

#### Get Session Statistics
```http
GET /host/session/:sessionCode/stats
Authorization: Bearer {token}
```

#### End Game Session
```http
POST /host/session/:sessionCode/end
Authorization: Bearer {token}
```

#### Delete Session
```http
DELETE /host/session/:sessionCode
Authorization: Bearer {token}
```

### User Endpoints

#### Get User Profile
```http
GET /users/:id
```

#### Update Avatar
```http
PUT /users/avatar
Authorization: Bearer {token}
Content-Type: application/json

{
  "avatar": "url"
}
```

#### Get User Statistics
```http
GET /users/me/statistics
Authorization: Bearer {token}
```

#### Get User Quizzes
```http
GET /users/:id/quizzes?page=1&limit=12
```

#### Search Users
```http
GET /users/search?q=username&page=1&limit=10
```

#### Get Top Creators
```http
GET /users/top-creators?limit=10
```

#### Delete Account
```http
DELETE /users/account
Authorization: Bearer {token}
```

## 🔌 Socket.IO Events

### Client -> Server Events

#### Host Events
- `host:create-session` - Create a new game session
- `host:start-game` - Start the quiz
- `host:send-question` - Send question to players
- `host:show-results` - Show question results
- `host:end-game` - End the game

#### Player Events
- `player:join-session` - Join a game session
- `player:submit-answer` - Submit answer to question

### Server -> Client Events

#### Game Events
- `game:started` - Game has started
- `game:ended` - Game has ended

#### Question Events
- `question:received` - New question received
- `results:shown` - Question results shown

#### Player Events
- `player:joined` - New player joined
- `player:left` - Player left
- `player:answered` - Player submitted answer

## 📊 Database Models

### User Model
- username, email, password
- firstName, lastName, avatar, bio
- isVerified, role
- statistics (quizzesCreated, quizzesPlayed, totalScore)

### Quiz Model
- title, description, detailedDescription
- coverImage, categories, creator
- questions, difficulty, educationLevel
- isPublic, quizCode, timeLimit
- settings, statistics, tags, language

### Question Model
- quiz, questionText, questionImage
- questionType, answers (with isCorrect)
- points, timeLimit, explanation
- difficulty, order, statistics

### Category Model
- name (multi-language), slug
- description, icon, color
- quizCount, isActive

### GameSession Model
- quiz, host, sessionCode
- players (with scores and answers)
- currentQuestionIndex, status
- startedAt, completedAt, settings

### PlayHistory Model
- quiz, player, playerName
- session, mode (individual/group)
- score, correctAnswers, wrongAnswers
- timeSpent, answers, rank

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- Helmet.js for HTTP headers security
- Input validation with express-validator
- CORS configuration
- Environment variables for secrets

## 🎯 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

## 📝 Environment Variables

Required environment variables (see `.env` file):

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - JWT expiration time
- `EMAIL_SERVICE` - Email service provider
- `EMAIL_USERNAME` - Email account
- `EMAIL_PASSWORD` - Email password
- `EMAIL_FROM` - From email address
- `FRONTEND_URL` - Frontend URL for CORS

Optional:
- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary secret

## 🧪 Testing

The API can be tested using:
- Postman
- cURL
- REST Client VS Code extension
- Any HTTP client

## 📄 License

ISC

## 👥 Author

eQuization Team
