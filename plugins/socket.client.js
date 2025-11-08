import io from 'socket.io-client'

export default ({ app, store }, inject) => {
  // Socket.IO configuration
  const socketURL = process.env.SOCKET_URL || 'http://localhost:5000'
  
  let socket = null

  const socketService = {
    // Initialize socket connection
    connect() {
      if (!socket || !socket.connected) {
        socket = io(socketURL, {
          transports: ['websocket', 'polling'],
          autoConnect: false
        })

        // Connection event handlers
        socket.on('connect', () => {
          console.log('✅ Connected to socket server')
        })

        socket.on('disconnect', () => {
          console.log('❌ Disconnected from socket server')
        })

        socket.on('error', (error) => {
          console.error('Socket error:', error)
        })

        socket.connect()
      }
      return socket
    },

    // Disconnect socket
    disconnect() {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    },

    // Get socket instance
    getSocket() {
      return socket
    },

    // Host creates a game session
    createSession(data, callback) {
      if (socket) {
        socket.emit('host:create-session', data, callback)
      }
    },

    // Player joins a session
    joinSession(data, callback) {
      if (socket) {
        socket.emit('player:join-session', data, callback)
      }
    },

    // Host starts the game
    startGame(data, callback) {
      if (socket) {
        socket.emit('host:start-game', data, callback)
      }
    },

    // Host sends a question
    sendQuestion(data, callback) {
      if (socket) {
        socket.emit('host:send-question', data, callback)
      }
    },

    // Player submits answer
    submitAnswer(data, callback) {
      if (socket) {
        socket.emit('player:submit-answer', data, callback)
      }
    },

    // Host shows results
    showResults(data, callback) {
      if (socket) {
        socket.emit('host:show-results', data, callback)
      }
    },

    // Host ends game
    endGame(data, callback) {
      if (socket) {
        socket.emit('host:end-game', data, callback)
      }
    },

    // Listen to events
    on(event, callback) {
      if (socket) {
        socket.on(event, callback)
      }
    },

    // Remove event listener
    off(event, callback) {
      if (socket) {
        socket.off(event, callback)
      }
    },

    // Emit custom event
    emit(event, data, callback) {
      if (socket) {
        socket.emit(event, data, callback)
      }
    }
  }

  // Inject socket service into Vue context
  inject('socket', socketService)
}
