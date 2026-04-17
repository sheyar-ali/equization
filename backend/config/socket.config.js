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
  // ✅ Fix #2: playerId → { timer, sessionCode, socketId } — grace period before marking inactive
  const disconnectTimers = new Map();
  // ✅ Fix #3: sessionCode → setTimeout ID — server-side question timeout
  const questionTimers = new Map();
  const RECONNECT_GRACE_MS = 15000; // 15 seconds grace period

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

        // ✅ Fix #5: Verify this socket is the actual host
        const mem = activeSessions.get(code);
        if (!mem || mem.hostSocketId !== socket.id)
          return ack?.({ success: false, message: 'Unauthorized: not the host' });

        const session = await GameSession.findOne({ sessionCode: code });

        if (!session)
          return ack?.({ success: false, message: 'Session not found' });

        if (session.players.length === 0)
          return ack?.({ success: false, message: 'No players in session' });

        session.status    = 'in-progress';
        session.startedAt = new Date();
        await session.save();

        if (mem) mem.answeredCount = 0;

        io.to(`session:${code}`).emit('game:started', {
          questionCount: mem?.questionCount || 0,
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

        // ✅ Fix #5: Verify this socket is the actual host
        if (!mem || mem.hostSocketId !== socket.id)
          return ack?.({ success: false, message: 'Unauthorized: not the host' });

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

        // ✅ Fix #3: Server-side question timeout
        // Clear any previous timer for this session
        if (questionTimers.has(code)) clearTimeout(questionTimers.get(code));
        const timeoutMs = (question.timeLimit + 2) * 1000; // +2s buffer
        const timer = setTimeout(() => {
          questionTimers.delete(code);
          const memNow = activeSessions.get(code);
          if (!memNow) return;
          console.log(`[Socket] ⏰ Question timeout in ${code} — auto-notifying host`);
          io.to(memNow.hostSocketId).emit('question:timeout', {
            sessionCode: code,
            questionIndex
          });
        }, timeoutMs);
        questionTimers.set(code, timer);

      } catch (err) {
        console.error('[Socket] host:send-question error:', err.message);
        ack?.({ success: false, message: err.message });
      }
    });

    // ── 5. PLAYER: Submit answer ──────────────────────────────────────────────
    // Emit: player:submit-answer { sessionCode, questionId, selectedAnswers[], timeSpent }
    // ACK:  { success, isCorrect, points, totalScore }
    socket.on('player:submit-answer', async ({ questionId, selectedAnswers, timeSpent } = {}, ack) => {
      try {
        const meta    = socketMeta.get(socket.id);
        // ✅ Fix #6: Use sessionCode from server-side socketMeta, not from client payload
        const code    = meta?.sessionCode?.toUpperCase();
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

        // ✅ Fix #7: Clamp timeSpent to valid range
        const timeLimitMs    = question.timeLimit * 1000;
        const clampedTime    = Math.max(0, Math.min(timeSpent || 0, timeLimitMs));

        let points = 0;
        if (isCorrect) {
          // Time bonus: faster → more points (min 50% of question points)
          const timeRatio      = 1 - (clampedTime / timeLimitMs) * 0.5;
          points               = Math.round(question.points * timeRatio);
        }

        const answerDoc = {
          question:        question._id,
          selectedAnswers: selectedAnswers || [],
          isCorrect,
          timeSpent: clampedTime,
          points,
          answeredAt: new Date()
        };

        // ✅ Fix #8: Atomic update — avoids lost-update problem with 100 concurrent players
        await GameSession.updateOne(
          { sessionCode: code, 'players._id': meta.playerId },
          {
            $push: { 'players.$.answers': answerDoc },
            $inc:  { 'players.$.score': points }
          }
        );

        // ── Track answered count, notify host ─────────────────────────────────
        // ✅ Fix #4: answeredCount is now safely incremented (single-threaded sync)
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
            totalScore:    player.score + points,
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
          totalScore: player.score + points
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

        // ✅ Fix #5: Verify this socket is the actual host
        const mem = activeSessions.get(code);
        if (!mem || mem.hostSocketId !== socket.id)
          return ack?.({ success: false, message: 'Unauthorized: not the host' });

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

        // ✅ Fix #5: Verify this socket is the actual host
        const memCheck = activeSessions.get(code);
        if (!memCheck || memCheck.hostSocketId !== socket.id)
          return ack?.({ success: false, message: 'Unauthorized: not the host' });

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

        // ✅ Fix #10: Clean up socketMeta for all players to prevent memory leak
        for (const [sid, sMeta] of socketMeta.entries()) {
          if (sMeta.sessionCode === code) {
            socketMeta.delete(sid);
          }
        }

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

        // ✅ Fix #5: Verify this socket is the actual host
        const memKick = activeSessions.get(code);
        if (!memKick || memKick.hostSocketId !== socket.id)
          return ack?.({ success: false, message: 'Unauthorized: not the host' });

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

    // ── ✅ Fix #2: Player reconnection handler ──────────────────────────────
    // Emit: player:reconnect { sessionCode, playerId }
    // ACK:  { success, score, answeredQuestions }
    socket.on('player:reconnect', async ({ sessionCode, playerId } = {}, ack) => {
      try {
        if (!sessionCode || !playerId)
          return ack?.({ success: false, message: 'sessionCode and playerId required' });

        const code = sessionCode.toUpperCase();

        // Cancel the grace-period timer if still running
        const pending = disconnectTimers.get(playerId);
        if (pending) {
          clearTimeout(pending.timer);
          disconnectTimers.delete(playerId);
        }

        const session = await GameSession.findOne({ sessionCode: code });
        if (!session || session.status === 'completed')
          return ack?.({ success: false, message: 'Session not found or already completed' });

        const player = session.players.id(playerId);
        if (!player)
          return ack?.({ success: false, message: 'Player not found' });

        // Reactivate the player
        player.isActive = true;
        player.socketId = socket.id;
        await session.save();

        // Update maps
        socketMeta.set(socket.id, { sessionCode: code, playerId, role: 'player' });
        socket.join(`session:${code}`);

        // Notify everyone
        io.to(`session:${code}`).emit('player:reconnected', {
          playerId,
          playerName: player.name,
          totalPlayers: session.players.filter(p => p.isActive).length
        });

        console.log(`[Socket] 🔄 Player "${player.name}" reconnected to ${code}`);

        ack?.({
          success: true,
          score: player.score,
          answeredQuestions: player.answers.map(a => a.question?.toString()),
          currentQuestionIndex: session.currentQuestionIndex,
          status: session.status
        });
      } catch (err) {
        console.error('[Socket] player:reconnect error:', err.message);
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
        // ✅ Fix #2: Grace period — wait before marking player inactive
        const gracePeriodTimer = setTimeout(async () => {
          disconnectTimers.delete(playerId);
          try {
            const session = await GameSession.findOne({ sessionCode: code });
            if (!session || session.status === 'completed') return;

            const player = session.players.id(playerId);
            if (player && player.isActive) {
              player.isActive = false;
              await session.save();

              io.to(`session:${code}`).emit('player:left', {
                playerId,
                playerName:   player.name,
                totalPlayers: session.players.filter(p => p.isActive).length
              });
              console.log(`[Socket] ⏳ Grace period expired for "${player.name}" in ${code}`);
            }
          } catch (err) {
            console.error('[Socket] disconnect grace-period cleanup error:', err.message);
          }
        }, RECONNECT_GRACE_MS);

        disconnectTimers.set(playerId, { timer: gracePeriodTimer, sessionCode: code, socketId: socket.id });

        // Notify host that player is temporarily disconnected
        const mem = activeSessions.get(code);
        if (mem) {
          io.to(mem.hostSocketId).emit('player:temporarily-disconnected', {
            playerId,
            graceMs: RECONNECT_GRACE_MS
          });
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
