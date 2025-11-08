export default function ({ $axios }, inject) {
  // Create API service
  const api = {
    // Auth endpoints
    auth: {
      register: (data) => $axios.post('/auth/register', data),
      login: (data) => $axios.post('/auth/login', data),
      logout: () => $axios.post('/auth/logout'),
      verifyEmail: (token) => $axios.post('/auth/verify-email', { token }),
      forgotPassword: (email) => $axios.post('/auth/forgot-password', { email }),
      resetPassword: (data) => $axios.post('/auth/reset-password', data),
      getMe: () => $axios.get('/auth/me'),
      updateDetails: (data) => $axios.put('/auth/update-details', data),
      updatePassword: (data) => $axios.put('/auth/update-password', data)
    },

    // Quiz endpoints
    quizzes: {
      getAll: (params) => $axios.get('/quizzes', { params }),
      getFeatured: (params) => $axios.get('/quizzes/featured', { params }),
      getById: (id) => $axios.get(`/quizzes/${id}`),
      getByCode: (code) => $axios.get(`/quizzes/code/${code}`),
      create: (data) => $axios.post('/quizzes', data),
      update: (id, data) => $axios.put(`/quizzes/${id}`, data),
      delete: (id) => $axios.delete(`/quizzes/${id}`),
      getMyQuizzes: (params) => $axios.get('/quizzes/user/my-quizzes', { params }),
      duplicate: (id) => $axios.post(`/quizzes/${id}/duplicate`),
      getStatistics: (id) => $axios.get(`/quizzes/${id}/statistics`)
    },

    // Question endpoints
    questions: {
      create: (data) => $axios.post('/questions', data),
      getQuizQuestions: (quizId) => $axios.get(`/questions/quiz/${quizId}`),
      getById: (id) => $axios.get(`/questions/${id}`),
      update: (id, data) => $axios.put(`/questions/${id}`, data),
      delete: (id) => $axios.delete(`/questions/${id}`),
      bulkCreate: (data) => $axios.post('/questions/bulk', data),
      reorder: (data) => $axios.put('/questions/reorder', data)
    },

    // Category endpoints
    categories: {
      getAll: () => $axios.get('/categories'),
      getPopular: (params) => $axios.get('/categories/popular', { params }),
      getById: (id) => $axios.get(`/categories/${id}`)
    },

    // Play endpoints
    play: {
      start: (data) => $axios.post('/play/start', data),
      submit: (data) => $axios.post('/play/submit', data),
      getLeaderboard: (quizId, params) => $axios.get(`/play/leaderboard/${quizId}`, { params }),
      getHistory: (params) => $axios.get('/play/history', { params }),
      getResult: (historyId) => $axios.get(`/play/result/${historyId}`)
    },

    // Host endpoints
    host: {
      createSession: (data) => $axios.post('/host/create-session', data),
      getSession: (sessionCode) => $axios.get(`/host/session/${sessionCode}`),
      getMySessions: () => $axios.get('/host/my-sessions'),
      getSessionStats: (sessionCode) => $axios.get(`/host/session/${sessionCode}/stats`),
      endSession: (sessionCode) => $axios.post(`/host/session/${sessionCode}/end`),
      deleteSession: (sessionCode) => $axios.delete(`/host/session/${sessionCode}`)
    },

    // User endpoints
    users: {
      getProfile: (id) => $axios.get(`/users/${id}`),
      getQuizzes: (id, params) => $axios.get(`/users/${id}/quizzes`, { params }),
      search: (params) => $axios.get('/users/search', { params }),
      getTopCreators: (params) => $axios.get('/users/top-creators', { params }),
      updateAvatar: (data) => $axios.put('/users/avatar', data),
      getStatistics: () => $axios.get('/users/me/statistics'),
      deleteAccount: () => $axios.delete('/users/account')
    }
  }

  // Inject API into context
  inject('api', api)
}
