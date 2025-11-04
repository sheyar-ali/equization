# eQuization Backend - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
cd /home/user/webapp/backend
npm install
```

### 2. Configure Environment
Edit the `.env` file with your settings:
```bash
# Minimum required configuration
MONGODB_URI=mongodb://localhost:27017/equization
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Start MongoDB
```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 4. Seed Initial Data (Optional)
```bash
node config/seed.js
```

### 5. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will be running at: `http://localhost:5000`

## ✅ Verify Installation

### Check API Health
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "eQuization API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get Categories
```bash
curl http://localhost:5000/api/v1/categories
```

## 📝 First Steps

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

Save the returned `token` for authenticated requests.

### 3. Create a Quiz
```bash
curl -X POST http://localhost:5000/api/v1/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Quiz",
    "description": "This is a test quiz with some interesting questions",
    "categories": ["CATEGORY_ID_FROM_SEED"],
    "difficulty": "medium",
    "isPublic": true
  }'
```

### 4. Add Questions
```bash
curl -X POST http://localhost:5000/api/v1/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "quiz": "YOUR_QUIZ_ID",
    "questionText": "What is 2 + 2?",
    "questionType": "multiple-choice",
    "answers": [
      {"text": "3", "isCorrect": false},
      {"text": "4", "isCorrect": true},
      {"text": "5", "isCorrect": false}
    ],
    "timeLimit": 30,
    "points": 100
  }'
```

## 🔧 Common Tasks

### Reset Database
```bash
mongo equization --eval "db.dropDatabase()"
node config/seed.js
```

### View Logs
Server logs are output to console. For production, consider using PM2:
```bash
npm install -g pm2
pm2 start server.js --name equization-api
pm2 logs equization-api
```

### Test Socket.IO Connection
Use Socket.IO client tester or create a simple HTML file:
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>Socket.IO Test</h1>
  <div id="status">Connecting...</div>
  <script>
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      document.getElementById('status').textContent = 'Connected!';
      console.log('Connected to server');
    });
    
    socket.on('disconnect', () => {
      document.getElementById('status').textContent = 'Disconnected';
      console.log('Disconnected from server');
    });
  </script>
</body>
</html>
```

## 📚 API Documentation

Full API documentation is available in `README.md`.

Key endpoints:
- **Authentication**: `/api/v1/auth/*`
- **Quizzes**: `/api/v1/quizzes/*`
- **Questions**: `/api/v1/questions/*`
- **Categories**: `/api/v1/categories/*`
- **Play**: `/api/v1/play/*`
- **Host**: `/api/v1/host/*`
- **Users**: `/api/v1/users/*`

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version
sudo systemctl status mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/equization
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 PID

# Or change port in .env
PORT=5001
```

### Email Not Sending
For development, you can use:
- Gmail with App Password
- Mailtrap.io (test email service)
- Disable email verification temporarily

## 🎮 Testing Real-time Features

### Host a Quiz Session
1. Create a quiz and add questions
2. Use Socket.IO client to emit `host:create-session`
3. Players join using `player:join-session`
4. Host starts game with `host:start-game`
5. Send questions with `host:send-question`

### Example Socket.IO Events
```javascript
// Host creates session
socket.emit('host:create-session', {
  quizId: 'YOUR_QUIZ_ID',
  hostId: 'YOUR_USER_ID',
  settings: { maxPlayers: 250 }
}, (response) => {
  console.log('Session code:', response.session.sessionCode);
});

// Player joins
socket.emit('player:join-session', {
  sessionCode: 'ABC123',
  playerName: 'John Doe'
}, (response) => {
  console.log('Joined:', response);
});
```

## 📊 Database Schema

The backend uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `categories` - Quiz categories
- `quizzes` - Quiz definitions
- `questions` - Quiz questions and answers
- `gamesessions` - Live game sessions
- `playhistories` - Completed quiz results

## 🔐 Security Notes

**Important for Production:**

1. Change `JWT_SECRET` to a strong random string
2. Use environment-specific `.env` files
3. Enable HTTPS
4. Configure proper CORS origins
5. Use strong password policies
6. Set up rate limiting properly
7. Regular security audits
8. Keep dependencies updated

## 📞 Support

For issues or questions:
1. Check the main `README.md`
2. Review API documentation
3. Check MongoDB logs
4. Enable debug mode: `NODE_ENV=development npm run dev`

## 🎉 You're Ready!

Your eQuization backend is now running. Start building amazing quiz experiences!

Next steps:
- Connect your Nuxt.js frontend
- Test all API endpoints
- Create your first quiz
- Host a live session
- Customize and extend
