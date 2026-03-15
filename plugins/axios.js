export default function ({ $axios, redirect }) {
  // Set base URL from environment variable
  $axios.setBaseURL(process.env.API_BASE_URL || 'http://localhost:5000/api/v1')

  // Request interceptor - add auth token from localStorage
  $axios.onRequest(config => {
    try {
      const token = typeof localStorage !== 'undefined'
        ? localStorage.getItem('token')
        : null
      if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
      }
    } catch (e) {
      // localStorage not available (SSR), skip
    }
    return config
  })

  // Response interceptor - handle errors
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)

    if (code === 401) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (e) {}
      redirect('/auth/login')
    }

    if (code === 500) {
      console.error('Server error:', error.response?.data)
    }

    return Promise.reject(error)
  })
}
