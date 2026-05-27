import io from 'socket.io-client'

export default ({ app, store }, inject) => {
  // Derive the socket URL from the current browser origin dynamically.
  // Sandbox frontend runs on port 3000 → backend on port 5000 (same subdomain).
  const origin = (typeof window !== 'undefined') ? window.location.origin : ''
  const socketURL = origin.includes('sandbox.novita.ai')
    ? origin.replace(/^(https?:\/\/)\d+(-[^.]+\.sandbox\.novita\.ai.*)$/, '$15000$2')
    : (process.env.SOCKET_URL || 'http://localhost:5000')

  let socket = null

  // Re-register host/player session after a socket reconnect.
  // Called every time the 'connect' event fires (initial + every reconnect).
  function _onConnectRestore() {
    try {
      const role        = sessionStorage.getItem('socketRole')
      const sessionCode = sessionStorage.getItem('sessionCode')
      const playerId    = sessionStorage.getItem('playerId')

      if (role === 'host' && sessionCode) {
        socket.emit('host:register-session', { sessionCode }, (ack) => {
          if (ack?.success) console.log('[Socket] 🔄 Host re-registered:', sessionCode)
          else console.warn('[Socket] Host re-register failed:', ack?.message)
        })
      } else if (role === 'player' && sessionCode && playerId) {
        socket.emit('player:reconnect', { sessionCode, playerId }, (ack) => {
          if (ack?.success) console.log('[Socket] 🔄 Player reconnected:', playerId)
        })
      }
    } catch (e) {}
  }

  const socketService = {
    // Initialize or reuse socket connection
    connect() {
      if (socket && socket.connected) {
        return socket
      }

      if (socket && !socket.connected) {
        socket.connect()
        return socket
      }

      // Create a new socket instance
      socket = io(socketURL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000,
      })

      socket.on('connect', () => {
        console.log('[Socket] ✅ Connected:', socket.id)
        _onConnectRestore()
      })
      socket.on('disconnect', (reason) => {
        console.log('[Socket] ❌ Disconnected:', reason)
      })
      socket.on('connect_error', (err) => {
        console.error('[Socket] Connection error:', err.message)
      })

      return socket
    },

    // Force a fresh socket connection (useful when switching sessions/players)
    reconnect() {
      if (socket) {
        socket.disconnect()
        socket = null
      }
      return this.connect()
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

    // Check if socket is ready (connected)
    isConnected() {
      return socket && socket.connected
    },

    // ── HOST: create session via socket
    // data = { quizId }
    createSession(data, callback) {
      if (socket && socket.connected) {
        socket.emit('host:create-session', data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    },

    // ── PLAYER: join session
    // data = { sessionCode, playerName, userId? }
    joinSession(data, callback) {
      if (socket && socket.connected) {
        socket.emit('player:join-session', data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    },

    // ── HOST: start game
    // data = { sessionCode }
    startGame(data, callback) {
      if (socket && socket.connected) {
        socket.emit('host:start-game', data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    },

    // ── HOST: send question
    // data = { sessionCode, questionIndex }
    sendQuestion(data, callback) {
      if (socket && socket.connected) {
        socket.emit('host:send-question', data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    },

    // ── PLAYER: submit answer
    // data = { sessionCode, questionId, selectedAnswers[], timeSpent }
    submitAnswer(data, callback) {
      if (socket && socket.connected) {
        socket.emit('player:submit-answer', data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    },

    // ── HOST: show results
    // data = { sessionCode, questionIndex }
    showResults(data, callback) {
      if (socket && socket.connected) {
        socket.emit('host:show-results', data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    },

    // ── HOST: end game
    // data = { sessionCode }
    endGame(data, callback) {
      if (socket && socket.connected) {
        socket.emit('host:end-game', data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    },

    on(event, callback) {
      if (socket) socket.on(event, callback)
    },

    off(event, callback) {
      if (socket) socket.off(event, callback)
    },

    // Drop all existing listeners for `event`, then register `handler` as the sole listener.
    // Use this for navigation-critical events to prevent double-fire during Vue page transitions
    // (Vue mounts the incoming page before destroying the outgoing one, so without this guard
    // both pages would have active listeners simultaneously).
    swapOn(event, handler) {
      if (socket) {
        socket.off(event)
        socket.on(event, handler)
      }
    },

    emit(event, data, callback) {
      if (socket && socket.connected) {
        socket.emit(event, data, callback)
      } else {
        callback?.({ success: false, message: 'Socket not connected' })
      }
    }
  }

  inject('socket', socketService)
}
