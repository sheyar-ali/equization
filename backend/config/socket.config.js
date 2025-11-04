const GameSession = require('../models/GameSession.model');
const Quiz = require('../models/Quiz.model');
const Question = require('../models/Question.model');

module.exports = (io) => {
  // Store active game sessions in memory for quick access
  const activeSessions = new Map();

  io.on('connection', (socket) => {
    console.log(`✅ New client connected: ${socket.id}`);

    // Host creates a new game session
    socket.on('host:create-session', async (data, callback) => {
      try {
        const { quizId, hostId, settings } = data;

        // Verify quiz exists
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
          return callback({ success: false, message: 'Quiz not found' });
        }

        // Create new game session
        const session = new GameSession({
          quiz: quizId,
          host: hostId,
          settings: settings || {}
        });

        await session.save();

        // Store in memory
        activeSessions.set(session.sessionCode, {
          sessionId: session._id,
          hostSocketId: socket.id,
          quiz,
          players: []
        });

        // Join host to session room
        socket.join(`session:${session.sessionCode}`);

        callback({
          success: true,
          session: {
            sessionCode: session.sessionCode,
            quizTitle: quiz.title,
            questionCount: quiz.questions.length
          }
        });

        console.log(`🎮 Session created: ${session.sessionCode}`);
      } catch (error) {
        console.error('Error creating session:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Player joins a game session
    socket.on('player:join-session', async (data, callback) => {
      try {
        const { sessionCode, playerName, userId } = data;

        // Find session
        const session = await GameSession.findOne({ sessionCode }).populate('quiz');
        if (!session) {
          return callback({ success: false, message: 'Session not found' });
        }

        if (session.status !== 'waiting') {
          return callback({ success: false, message: 'Session already started' });
        }

        // Check if max players reached
        if (session.players.length >= session.settings.maxPlayers) {
          return callback({ success: false, message: 'Session is full' });
        }

        // Add player to session
        const player = {
          socketId: socket.id,
          name: playerName,
          user: userId || null,
          score: 0,
          answers: []
        };

        session.players.push(player);
        await session.save();

        // Update memory
        const memorySession = activeSessions.get(sessionCode);
        if (memorySession) {
          memorySession.players.push(player);
        }

        // Join player to session room
        socket.join(`session:${sessionCode}`);

        // Store session code in socket
        socket.sessionCode = sessionCode;
        socket.playerId = player._id;

        // Notify host
        io.to(`session:${sessionCode}`).emit('player:joined', {
          player: {
            id: player._id,
            name: playerName,
            score: 0
          },
          totalPlayers: session.players.length
        });

        callback({
          success: true,
          session: {
            quizTitle: session.quiz.title,
            playerCount: session.players.length
          }
        });

        console.log(`👤 Player ${playerName} joined session ${sessionCode}`);
      } catch (error) {
        console.error('Error joining session:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Host starts the game
    socket.on('host:start-game', async (data, callback) => {
      try {
        const { sessionCode } = data;

        const session = await GameSession.findOne({ sessionCode })
          .populate({
            path: 'quiz',
            populate: { path: 'questions' }
          });

        if (!session) {
          return callback({ success: false, message: 'Session not found' });
        }

        // Update session status
        session.status = 'in-progress';
        session.startedAt = new Date();
        await session.save();

        // Notify all players
        io.to(`session:${sessionCode}`).emit('game:started', {
          message: 'Game is starting!',
          questionCount: session.quiz.questions.length
        });

        callback({ success: true });

        console.log(`🚀 Game started: ${sessionCode}`);
      } catch (error) {
        console.error('Error starting game:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Host sends question to players
    socket.on('host:send-question', async (data, callback) => {
      try {
        const { sessionCode, questionIndex } = data;

        const session = await GameSession.findOne({ sessionCode })
          .populate({
            path: 'quiz',
            populate: { path: 'questions' }
          });

        if (!session) {
          return callback({ success: false, message: 'Session not found' });
        }

        const question = session.quiz.questions[questionIndex];
        if (!question) {
          return callback({ success: false, message: 'Question not found' });
        }

        // Update session
        session.currentQuestionIndex = questionIndex;
        session.status = 'question-active';
        await session.save();

        // Prepare question data (without correct answer)
        const questionData = {
          questionIndex,
          questionText: question.questionText,
          questionImage: question.questionImage,
          questionType: question.questionType,
          answers: question.answers.map(answer => ({
            _id: answer._id,
            text: answer.text,
            image: answer.image
          })),
          timeLimit: question.timeLimit,
          points: question.points
        };

        // Send to all players
        io.to(`session:${sessionCode}`).emit('question:received', questionData);

        callback({ success: true });

        console.log(`❓ Question ${questionIndex + 1} sent to session ${sessionCode}`);
      } catch (error) {
        console.error('Error sending question:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Player submits answer
    socket.on('player:submit-answer', async (data, callback) => {
      try {
        const { sessionCode, questionIndex, selectedAnswers, timeSpent } = data;

        const session = await GameSession.findOne({ sessionCode })
          .populate({
            path: 'quiz',
            populate: { path: 'questions' }
          });

        if (!session) {
          return callback({ success: false, message: 'Session not found' });
        }

        const question = session.quiz.questions[questionIndex];
        const player = session.players.id(socket.playerId);

        if (!player) {
          return callback({ success: false, message: 'Player not found' });
        }

        // Check if answer is correct
        const correctAnswerIds = question.answers
          .filter(a => a.isCorrect)
          .map(a => a._id.toString());
        
        const selectedIds = selectedAnswers.map(id => id.toString());
        const isCorrect = correctAnswerIds.length === selectedIds.length &&
          correctAnswerIds.every(id => selectedIds.includes(id));

        // Calculate points (faster answers get more points)
        let points = 0;
        if (isCorrect) {
          const timePercentage = timeSpent / (question.timeLimit * 1000);
          points = Math.round(question.points * (1 - timePercentage * 0.5));
          player.score += points;
        }

        // Record answer
        player.answers.push({
          question: question._id,
          selectedAnswers,
          isCorrect,
          timeSpent,
          points,
          answeredAt: new Date()
        });

        await session.save();

        // Notify host of answer submission
        io.to(activeSessions.get(sessionCode)?.hostSocketId).emit('player:answered', {
          playerId: player._id,
          playerName: player.name,
          isCorrect,
          points,
          timeSpent
        });

        callback({
          success: true,
          isCorrect,
          points,
          totalScore: player.score
        });

      } catch (error) {
        console.error('Error submitting answer:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Host shows question results
    socket.on('host:show-results', async (data, callback) => {
      try {
        const { sessionCode, questionIndex } = data;

        const session = await GameSession.findOne({ sessionCode })
          .populate({
            path: 'quiz',
            populate: { path: 'questions' }
          });

        if (!session) {
          return callback({ success: false, message: 'Session not found' });
        }

        const question = session.quiz.questions[questionIndex];
        
        // Update session status
        session.status = 'showing-results';
        await session.save();

        // Calculate statistics
        const answerStats = {};
        let correctCount = 0;

        session.players.forEach(player => {
          const playerAnswer = player.answers.find(
            a => a.question.toString() === question._id.toString()
          );
          if (playerAnswer) {
            if (playerAnswer.isCorrect) correctCount++;
            playerAnswer.selectedAnswers.forEach(answerId => {
              const id = answerId.toString();
              answerStats[id] = (answerStats[id] || 0) + 1;
            });
          }
        });

        // Prepare results data
        const resultsData = {
          questionIndex,
          correctAnswers: question.answers
            .filter(a => a.isCorrect)
            .map(a => a._id),
          answerStats,
          correctCount,
          totalPlayers: session.players.length,
          leaderboard: session.players
            .map(p => ({
              name: p.name,
              score: p.score
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
        };

        // Send to all players
        io.to(`session:${sessionCode}`).emit('results:shown', resultsData);

        callback({ success: true });

      } catch (error) {
        console.error('Error showing results:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Host ends game
    socket.on('host:end-game', async (data, callback) => {
      try {
        const { sessionCode } = data;

        const session = await GameSession.findOne({ sessionCode });
        if (!session) {
          return callback({ success: false, message: 'Session not found' });
        }

        // Update session
        session.status = 'completed';
        session.completedAt = new Date();
        await session.save();

        // Calculate final rankings
        const finalResults = session.players
          .map(p => ({
            name: p.name,
            score: p.score,
            correctAnswers: p.answers.filter(a => a.isCorrect).length,
            totalQuestions: p.answers.length
          }))
          .sort((a, b) => b.score - a.score)
          .map((player, index) => ({
            ...player,
            rank: index + 1
          }));

        // Notify all players
        io.to(`session:${sessionCode}`).emit('game:ended', {
          finalResults
        });

        // Clean up
        activeSessions.delete(sessionCode);

        callback({ success: true });

        console.log(`🏁 Game ended: ${sessionCode}`);
      } catch (error) {
        console.error('Error ending game:', error);
        callback({ success: false, message: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ Client disconnected: ${socket.id}`);

      if (socket.sessionCode) {
        try {
          const session = await GameSession.findOne({ sessionCode: socket.sessionCode });
          if (session) {
            const player = session.players.find(p => p.socketId === socket.id);
            if (player) {
              // Mark player as inactive
              player.isActive = false;
              await session.save();

              // Notify others
              io.to(`session:${socket.sessionCode}`).emit('player:left', {
                playerId: player._id,
                playerName: player.name
              });
            }
          }
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      }
    });
  });

  return io;
};
