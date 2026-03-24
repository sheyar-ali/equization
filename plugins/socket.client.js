import io from 'socket.io-client'

export default ({ app, store }, inject) => {
  const socketURL = process.env.SOCKET_URL || 'http://localhost:5000'

  let socket = null

  const socketService = {
    // Initialize socket connection
    connect() {
      if (!socket || !socket.connected) {
        socket = io(socketURL, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        })

        socket.on('connect', () => {
          console.log('[Socket] ✅ Connected:', socket.id)
        })
        socket.on('disconnect', (reason) => {
          console.log('[Socket] ❌ Disconnected:', reason)
        })
        socket.on('connect_error', (err) => {
          console.error('[Socket] Connection error:', err.message)
        })
      }
      return socket
    },

    disconnect() {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    },

    getSocket() {
      return socket
    },

    // ── HOST: create session via socket
    // data = { quizId }
    createSession(data, callback) {
      if (socket) {
        socket.emit('host:create-session', data, callback)
      }
    },

    // ── PLAYER: join session
    // data = { sessionCode, playerName, userId? }
    joinSession(data, callback) {
      if (socket) {
        socket.emit('player:join-session', data, callback)
      }
    },

    // ── HOST: start game
    // data = { sessionCode }
    startGame(data, callback) {
      if (socket) {
        socket.emit('host:start-game', data, callback)
      }
    },

    // ── HOST: send question
    // data = { sessionCode, questionIndex }
    sendQuestion(data, callback) {
      if (socket) {
        socket.emit('host:send-question', data, callback)
      }
    },

    // ── PLAYER: submit answer
    // data = { sessionCode, questionId, selectedAnswers[], timeSpent }
    submitAnswer(data, callback) {
      if (socket) {
        socket.emit('player:submit-answer', data, callback)
      }
    },

    // ── HOST: show results
    // data = { sessionCode, questionIndex }
    showResults(data, callback) {
      if (socket) {
        socket.emit('host:show-results', data, callback)
      }
    },

    // ── HOST: end game
    // data = { sessionCode }
    endGame(data, callback) {
      if (socket) {
        socket.emit('host:end-game', data, callback)
      }
    },

    on(event, callback) {
      if (socket) socket.on(event, callback)
    },

    off(event, callback) {
      if (socket) socket.off(event, callback)
    },

    emit(event, data, callback) {
      if (socket) socket.emit(event, data, callback)
    }
  }

  inject('socket', socketService)
}
