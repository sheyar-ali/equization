/**
 * socket.config.js
 * Real-time game logic for eQuization
 *
 * Game flow:
 *   1. Host creates a session  ──►  waiting
 *   2. Players join via sessionCode
 *   3. Host starts the game    ──►  in-progress
 *   4. Host sends question     ──►  question-active
 *   5. Players submit answers
 *   6. Host shows results      ──►  showing-results (leaderboard)
 *   7. Repeat 4-6 for each question
 *   8. Host ends the game      ──►  completed
 */

const GameSession  = require('../models/GameSession.model');
const Quiz         = require('../models/Quiz.model');
const Question     = require('../models/Question.model');
const PlayHistory  = require('../models/PlayHistory.model');
const User         = require('../models/User.model');

module.exports = (io) => {

  // ── In-memory session map (sessionCode → data) ──────────────────────────────
  // Stores fast-access data alongside DB records
  const activeSessions = new Map();
  // socketId → { sessionCode, playerId, role: 'host'|'player' }
  const socketMeta = new Map();

  // ────────────────────────────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`[Socket] ✅ Connected: ${socket.id}`);

    // ── 1. HOST: Create a game session ────────────────────────────────────────
    // Emit: host:create-session { quizId }
    // ACK:  { success, sessionCode, quizTitle, questionCount }
    socket.on('host:create-session', async ({ quizId } = {}, ack) => {
      try {
        if (!quizId) return ack?.({ success: false, message: 'quizId required' });

        const quiz = await Quiz.findById(quizId)
          .populate({ path: 'questions', options: { sort: { order: 1 } } });

        if (!quiz)         return ack?.({ success: false, message: 'Quiz not found' });
        if (!quiz.questions?.length)
          return ack?.({ success: false, message: 'Quiz has no questions' });

        // Create DB session (sessionCode auto-generated in pre-save)
        const session = await GameSession.create({
          quiz:   quizId,
          host:   socket.handshake.auth?.userId || null,
          status: 'waiting',
          sessionCode: '' // will be replaced by pre-save hook
        });

        // Fix: pre-save will set sessionCode but we need to reload
        const saved = await GameSession.findById(session._id);

        // Cache in memory
        activeSessions.set(saved.sessionCode, {
          sessionId:    saved._id.toString(),
          hostSocketId: socket.id,
          quiz,                     // full quiz with questions
          questionCount: quiz.questions.length,
          answeredCount: 0,          // per-question tracker
          playerCount:  0
        });
        socketMeta.set(socket.id, { sessionCode: saved.sessionCode, role: 'host' });

        socket.join(`session:${saved.sessionCode}`);

        console.log(`[Socket] 🎮 Session created: ${saved.sessionCode}`);

        ack?.({
          success:       true,
          sessionCode:   saved.sessionCode,
          quizTitle:     quiz.title,
          questionCount: quiz.questions.length
        });

      } catch (err) {
        console.error('[Socket] host:create-session error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 1b. HOST: Register into an existing REST-created session ─────────────
    // Emit: host:register-session { sessionCode }
    // ACK:  { success, sessionCode, quizTitle, questionCount }
    socket.on('host:register-session', async ({ sessionCode } = {}, ack) => {
      try {
        if (!sessionCode) return ack?.({ success: false, message: 'sessionCode required' });

        const code    = sessionCode.toUpperCase();
        const session = await GameSession.findOne({ sessionCode: code })
          .populate({ path: 'quiz', populate: { path: 'questions', options: { sort: { order: 1 } } } });

        if (!session) return ack?.({ success: false, message: 'Session not found' });

        const quiz = session.quiz;

        // Cache in memory so player:join-session can find it
        if (!activeSessions.has(code)) {
          activeSessions.set(code, {
            sessionId:    session._id.toString(),
            hostSocketId: socket.id,
            quiz,
            questionCount: quiz.questions ? quiz.questions.length : 0,
            answeredCount: 0,
            playerCount:  session.players ? session.players.length : 0
          });
        } else {
          // Update host socket id
          activeSessions.get(code).hostSocketId = socket.id;
        }

        socketMeta.set(socket.id, { sessionCode: code, role: 'host' });
        socket.join(`session:${code}`);

        console.log(`[Socket] 🎮 Host registered for session: ${code}`);

        ack?.({
          success:       true,
          sessionCode:   code,
          quizTitle:     quiz ? quiz.title : '',
          questionCount: quiz && quiz.questions ? quiz.questions.length : 0
        });

      } catch (err) {
        console.error('[Socket] host:register-session error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 2. PLAYER: Join a game session ────────────────────────────────────────
    // Emit: player:join-session { sessionCode, playerName, userId? }
    // ACK:  { success, quizTitle, playerCount, playerId }
    socket.on('player:join-session', async ({ sessionCode, playerName, userId } = {}, ack) => {
      try {
        if (!sessionCode || !playerName)
          return ack?.({ success: false, message: 'sessionCode and playerName required' });

        const code    = sessionCode.toUpperCase();
        const session = await GameSession.findOne({ sessionCode: code });

        if (!session)
          return ack?.({ success: false, message: 'الجلسة غير موجودة. تأكد من الكود وحاول مجدداً.' });

        if (session.status !== 'waiting')
          return ack?.({ success: false, message: 'اللعبة بدأت بالفعل! لا يمكن الانضمام الآن.' });

        if (session.players.filter(p => p.isActive).length >= session.settings.maxPlayers)
          return ack?.({ success: false, message: 'الجلسة ممتلئة. لا توجد أماكن متاحة.' });

        // Check for duplicate name
        const nameTaken = session.players.some(p => p.name.toLowerCase() === playerName.toLowerCase() && p.isActive);
        if (nameTaken)
          return ack?.({ success: false, message: 'هذا الاسم مستخدم بالفعل. اختر اسماً آخر.' });

        // Add player
        session.players.push({
          socketId: socket.id,
          name:     playerName,
          user:     userId || null,
          score:    0,
          answers:  [],
          isActive: true
        });
        await session.save();

        const player   = session.players[session.players.length - 1];
        const playerId = player._id.toString();

        socketMeta.set(socket.id, { sessionCode: code, playerId, role: 'player' });
        socket.join(`session:${code}`);

        // Update memory cache
        const mem = activeSessions.get(code);
        if (mem) mem.playerCount = session.players.length;

        // Notify everyone in the room (host + other players)
        io.to(`session:${code}`).emit('player:joined', {
          playerId,
          playerName,
          totalPlayers: session.players.length
        });

        console.log(`[Socket] 👤 Player "${playerName}" joined session ${code}`);

        const quiz = await Quiz.findById(session.quiz).select('title');
        ack?.({
          success:      true,
          quizTitle:    quiz?.title || '',
          playerCount:  session.players.length,
          playerId
        });

      } catch (err) {
        console.error('[Socket] player:join-session error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 3. HOST: Start the game ───────────────────────────────────────────────
    // Emit: host:start-game { sessionCode }
    // ACK:  { success }
    socket.on('host:start-game', async ({ sessionCode } = {}, ack) => {
      try {
        const code    = sessionCode?.toUpperCase();
        const session = await GameSession.findOne({ sessionCode: code });

        if (!session)
          return ack?.({ success: false, message: 'Session not found' });

        if (session.players.length === 0)
          return ack?.({ success: false, message: 'No players in session' });

        session.status    = 'in-progress';
        session.startedAt = new Date();
        await session.save();

        const mem = activeSessions.get(code);
        if (mem) mem.answeredCount = 0;

        // ✅ إرسال startedAt حتى يتزامن المستضيف واللاعبين في الانتقال لأول سؤال
        io.to(`session:${code}`).emit('game:started', {
          questionCount: mem?.questionCount || 0,
          startedAt:     Date.now(),   // توقيت السيرفر لتزامن بدء اللعبة
          message:       'Game is starting!'
        });

        console.log(`[Socket] 🚀 Game started: ${code}`);
        ack?.({ success: true });

      } catch (err) {
        console.error('[Socket] host:start-game error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 4. HOST: Send a question ──────────────────────────────────────────────
    // Emit: host:send-question { sessionCode, questionIndex }
    // ACK:  { success, question }
    socket.on('host:send-question', async ({ sessionCode, questionIndex } = {}, ack) => {
      try {
        const code = sessionCode?.toUpperCase();
        const mem  = activeSessions.get(code);

        const session = await GameSession.findOne({ sessionCode: code })
          .populate({ path: 'quiz', populate: { path: 'questions', options: { sort: { order: 1 } } } });

        if (!session)
          return ack?.({ success: false, message: 'Session not found' });

        const question = session.quiz.questions[questionIndex];
        if (!question)
          return ack?.({ success: false, message: 'Question not found' });

        session.currentQuestionIndex = questionIndex;
        session.status               = 'question-active';
        session.questionStartedAt    = new Date();
        await session.save();

        // Reset per-question answered counter
        if (mem) mem.answeredCount = 0;

        // Sanitized answers for players (no isCorrect)
        const sanitizedAnswers = question.answers.map(a => ({
          _id:   a._id,
          text:  a.text,
          image: a.image
        }));

        // Full answers for host (with isCorrect)
        const fullAnswers = question.answers.map(a => ({
          _id:       a._id,
          text:      a.text,
          image:     a.image,
          isCorrect: a.isCorrect || false
        }));

        const questionStartedAt = Date.now(); // server timestamp for sync

        const questionDataForPlayers = {
          questionIndex,
          totalQuestions:  session.quiz.questions.length,
          questionId:      question._id,
          questionText:    question.questionText,
          questionImage:   question.questionImage,
          questionType:    question.questionType,
          answers:         sanitizedAnswers,
          timeLimit:       question.timeLimit,
          points:          question.points,
          startedAt:       questionStartedAt  // توقيت بداية السؤال للتزامن
        };

        // Broadcast to players (without isCorrect)
        io.to(`session:${code}`).emit('question:received', questionDataForPlayers);

        console.log(`[Socket] ❓ Question ${questionIndex + 1}/${session.quiz.questions.length} → ${code}`);

        // ACK to host includes full answers with isCorrect
        ack?.({
          success:  true,
          question: { ...questionDataForPlayers, fullAnswers }
        });

      } catch (err) {
        console.error('[Socket] host:send-question error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 5. PLAYER: Submit answer ──────────────────────────────────────────────
    // Emit: player:submit-answer { sessionCode, questionId, selectedAnswers[], timeSpent }
    // ACK:  { success, isCorrect, points, totalScore }
    socket.on('player:submit-answer', async ({ sessionCode, questionId, selectedAnswers, timeSpent } = {}, ack) => {
      try {
        const code    = sessionCode?.toUpperCase();
        const meta    = socketMeta.get(socket.id);
        if (!meta || !meta.playerId)
          return ack?.({ success: false, message: 'Player not found in session' });

        const session = await GameSession.findOne({ sessionCode: code })
          .populate({ path: 'quiz', populate: { path: 'questions' } });

        if (!session)
          return ack?.({ success: false, message: 'Session not found' });

        const player = session.players.id(meta.playerId);
        if (!player)
          return ack?.({ success: false, message: 'Player record not found' });

        // Prevent duplicate answer for same question
        const alreadyAnswered = player.answers.some(
          a => a.question?.toString() === questionId
        );
        if (alreadyAnswered)
          return ack?.({ success: false, message: 'Already answered this question' });

        // Find question
        const question = session.quiz.questions.find(q => q._id.toString() === questionId);
        if (!question)
          return ack?.({ success: false, message: 'Question not found' });

        // ── Score calculation ─────────────────────────────────────────────────
        const correctIds  = question.answers.filter(a => a.isCorrect).map(a => a._id.toString());
        const selectedIds = (selectedAnswers || []).map(id => id.toString());

        const isCorrect =
          correctIds.length === selectedIds.length &&
          correctIds.every(id => selectedIds.includes(id));

        let points = 0;
        if (isCorrect) {
          // Time bonus: faster → more points (min 50% of question points)
          const timeLimitMs    = question.timeLimit * 1000;
          const elapsed        = Math.min(timeSpent, timeLimitMs);
          const timeRatio      = 1 - (elapsed / timeLimitMs) * 0.5;
          points               = Math.round(question.points * timeRatio);
          player.score        += points;
        }

        player.answers.push({
          question:        question._id,
          selectedAnswers: selectedAnswers || [],
          isCorrect,
          timeSpent,
          points,
          answeredAt: new Date()
        });

        await session.save();

        // ── Track answered count, notify host ─────────────────────────────────
        const mem = activeSessions.get(code);
        if (mem) {
          mem.answeredCount = (mem.answeredCount || 0) + 1;
          const activePlayers = session.players.filter(p => p.isActive).length;

          // Notify host about this answer
          io.to(mem.hostSocketId).emit('player:answered', {
            playerId:      player._id,
            playerName:    player.name,
            isCorrect,
            points,
            totalScore:    player.score,
            answeredCount: mem.answeredCount,
            totalPlayers:  activePlayers
          });

          // ── Auto show results when ALL active players have answered ──────────
          if (mem.answeredCount >= activePlayers && activePlayers > 0) {
            console.log(`[Socket] ✅ All ${activePlayers} players answered in ${code} — triggering auto show-results`);
            io.to(mem.hostSocketId).emit('all:answered', {
              sessionCode:   code,
              answeredCount: mem.answeredCount,
              totalPlayers:  activePlayers
            });
          }
        }

        console.log(`[Socket] ✏️ ${player.name} answered Q${session.currentQuestionIndex + 1} → ${isCorrect ? '✅' : '❌'} ${points}pts`);

        ack?.({
          success:    true,
          isCorrect,
          points,
          totalScore: player.score
        });

      } catch (err) {
        console.error('[Socket] player:submit-answer error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 6. HOST: Show results (after question) ────────────────────────────────
    // Emit: host:show-results { sessionCode, questionIndex }
    // Broadcasts: results:shown { correctAnswer, leaderboard }
    socket.on('host:show-results', async ({ sessionCode, questionIndex } = {}, ack) => {
      try {
        const code    = sessionCode?.toUpperCase();
        const session = await GameSession.findOne({ sessionCode: code })
          .populate({ path: 'quiz', populate: { path: 'questions', options: { sort: { order: 1 } } } });

        if (!session)
          return ack?.({ success: false, message: 'Session not found' });

        session.status = 'showing-results';
        await session.save();

        const question    = session.quiz.questions[questionIndex];
        const correctAnswers = question?.answers
          .filter(a => a.isCorrect)
          .map(a => ({ _id: a._id, text: a.text, image: a.image }));

        // Build live leaderboard
        const leaderboard = session.players
          .filter(p => p.isActive)
          .map(p => ({
            id:    p._id,
            name:  p.name,
            score: p.score,
            lastAnswer: p.answers.find(a => a.question?.toString() === question?._id.toString())
          }))
          .sort((a, b) => b.score - a.score)
          .map((p, i) => ({ ...p, rank: i + 1 }));

        io.to(`session:${code}`).emit('results:shown', {
          questionIndex,
          correctAnswers,
          leaderboard
        });

        console.log(`[Socket] 📊 Results shown for Q${questionIndex + 1} in ${code}`);
        ack?.({ success: true, leaderboard, correctAnswers });

      } catch (err) {
        console.error('[Socket] host:show-results error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 7. HOST: End game ─────────────────────────────────────────────────────
    // Emit: host:end-game { sessionCode }
    // ACK:  { success, finalResults }
    socket.on('host:end-game', async ({ sessionCode } = {}, ack) => {
      try {
        const code    = sessionCode?.toUpperCase();
        const session = await GameSession.findOne({ sessionCode: code });

        if (!session)
          return ack?.({ success: false, message: 'Session not found' });

        session.status      = 'completed';
        session.completedAt = new Date();
        await session.save();

        // ── Save play history for each player ─────────────────────────────────
        const historyPromises = session.players.map(player => {
          const correct   = player.answers.filter(a => a.isCorrect).length;
          const wrong     = player.answers.length - correct;
          const timeTotal = player.answers.reduce((s, a) => s + (a.timeSpent || 0), 0);

          return PlayHistory.create({
            quiz:           session.quiz,
            player:         player.user || null,
            playerName:     player.name,
            session:        session._id,
            mode:           'group',
            score:          player.score,
            totalQuestions: player.answers.length,
            correctAnswers: correct,
            wrongAnswers:   wrong,
            timeSpent:      timeTotal,
            answers:        player.answers
          });
        });

        await Promise.all(historyPromises);

        // Update quiz statistics
        await Quiz.findByIdAndUpdate(session.quiz, {
          $inc: {
            'statistics.totalPlays':   1,
            'statistics.totalPlayers': session.players.length
          }
        });

        // Update user statistics for logged-in players
        const userUpdates = session.players
          .filter(p => p.user)
          .map(p =>
            User.findByIdAndUpdate(p.user, {
              $inc: { 'statistics.quizzesPlayed': 1, 'statistics.totalScore': p.score }
            })
          );
        await Promise.all(userUpdates);

        // Build final results
        const finalResults = session.players
          .map((p, _, arr) => {
            const rank = arr.filter(x => x.score > p.score).length + 1;
            return {
              id:             p._id,
              name:           p.name,
              score:          p.score,
              rank,
              correctAnswers: p.answers.filter(a => a.isCorrect).length,
              totalAnswers:   p.answers.length,
              accuracy:       p.answers.length
                ? ((p.answers.filter(a => a.isCorrect).length / p.answers.length) * 100).toFixed(1)
                : '0.0'
            };
          })
          .sort((a, b) => a.rank - b.rank);

        io.to(`session:${code}`).emit('game:ended', { finalResults });

        // Cleanup memory
        activeSessions.delete(code);
        console.log(`[Socket] 🏁 Game ended: ${code}`);

        ack?.({ success: true, finalResults });

      } catch (err) {
        console.error('[Socket] host:end-game error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── HOST: Kick a player ───────────────────────────────────────────────────
    // Emit: host:kick-player { sessionCode, playerId }
    socket.on('host:kick-player', async ({ sessionCode, playerId } = {}, ack) => {
      try {
        const code    = sessionCode?.toUpperCase();
        const session = await GameSession.findOne({ sessionCode: code });
        if (!session) return ack?.({ success: false, message: 'Session not found' });

        const player = session.players.id(playerId);
        if (!player)  return ack?.({ success: false, message: 'Player not found' });

        player.isActive = false;
        await session.save();

        // Notify the kicked player's socket
        if (player.socketId) {
          io.to(player.socketId).emit('player:kicked', { message: 'You have been removed by the host' });
        }

        io.to(`session:${code}`).emit('player:left', {
          playerId,
          playerName:   player.name,
          totalPlayers: session.players.filter(p => p.isActive).length
        });

        ack?.({ success: true });
      } catch (err) {
        ack?.({ success: false, message: err.message });
      }
    });

    // ── Disconnection handler ─────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`[Socket] ❌ Disconnected: ${socket.id}`);
      const meta = socketMeta.get(socket.id);
      if (!meta) return;

      const { sessionCode, playerId, role } = meta;
      socketMeta.delete(socket.id);

      if (!sessionCode) return;
      const code = sessionCode.toUpperCase();

      if (role === 'player') {
        try {
          const session = await GameSession.findOne({ sessionCode: code });
          if (!session || session.status === 'completed') return;

          const player = session.players.id(playerId);
          if (player) {
            player.isActive = false;
            await session.save();

            io.to(`session:${code}`).emit('player:left', {
              playerId,
              playerName:   player.name,
              totalPlayers: session.players.filter(p => p.isActive).length
            });
          }
        } catch (err) {
          console.error('[Socket] disconnect player cleanup error:', err.message);
        }
      }

      if (role === 'host') {
        // Notify all players the host disconnected
        io.to(`session:${code}`).emit('host:disconnected', {
          message: 'Host has disconnected. The game may be paused.'
        });
      }
    });

  }); // io.on('connection')
};
