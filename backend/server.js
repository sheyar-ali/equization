/**
 * server.js – eQuization Backend Entry Point
 */

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const dotenv    = require('dotenv');
const http      = require('http');
const socketIO  = require('socket.io');
const path      = require('path');

dotenv.config();

// ── Import routes ──────────────────────────────────────────────────────────────
const authRoutes     = require('./routes/auth.routes');
const userRoutes     = require('./routes/user.routes');
const quizRoutes     = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');
const categoryRoutes = require('./routes/category.routes');
const playRoutes     = require('./routes/play.routes');
const hostRoutes     = require('./routes/host.routes');

// ── Import middleware ──────────────────────────────────────────────────────────
const errorHandler                 = require('./middleware/error.middleware');
const { generalLimiter }           = require('./middleware/rateLimit.middleware');

// ── App setup ──────────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ── Socket.IO ──────────────────────────────────────────────────────────────────
const io = socketIO(server, {
  cors: {
    origin:      process.env.FRONTEND_URL || '*',
    methods:     ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Attach io to app so controllers can access it
app.set('io', io);

// ── Security & general middleware ──────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin:      process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Apply general rate limiter to all routes
app.use(generalLimiter);

// ── Static files ───────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',       authRoutes);
app.use('/api/v1/users',      userRoutes);
app.use('/api/v1/quizzes',    quizRoutes);
app.use('/api/v1/questions',  questionRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/play',       playRoutes);
app.use('/api/v1/host',       hostRoutes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success:   true,
    message:   'eQuization API is running',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
    database:  mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Error handler (must be last) ───────────────────────────────────────────────
app.use(errorHandler);

// ── Real-time game logic ───────────────────────────────────────────────────────
require('./config/socket.config')(io);

// ── Connect to MongoDB & start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`📡 Socket.IO ready for real-time connections`);
      console.log(`🔗 Health: http://localhost:${PORT}/api/v1/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = { app, server };
