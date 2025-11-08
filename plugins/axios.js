export default function ({ $axios, redirect, app, store }) {
  // Set base URL
  $axios.setBaseURL(process.env.API_BASE_URL || 'http://localhost:5000/api/v1')

  // Request interceptor - add auth token
  $axios.onRequest(config => {
    const token = app.$cookies.get('token') || localStorage.getItem('token')
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
  })

  // Response interceptor - handle errors
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    
    if (code === 401) {
      // Unauthorized - clear token and redirect to login
      app.$cookies.remove('token')
      localStorage.removeItem('token')
      redirect('/signin')
    }

    if (code === 404) {
      // Not found
      redirect('/404')
    }

    if (code === 500) {
      // Server error
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  })

  // Response interceptor - handle success
  $axios.onResponse(response => {
    return response
  })
}
