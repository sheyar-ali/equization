export default function ({ $axios, store, redirect, route }) {
  // ── Dynamic baseURL ──────────────────────────────────────────────────────
  // In a sandbox/cloud environment the public URL changes per session.
  // We derive the API base URL from the current browser origin so that
  // the frontend always talks to the correct backend regardless of sandbox ID.
  //
  // Convention used in this project:
  //   Frontend  → port 3000  (e.g. https://3000-<id>.sandbox.novita.ai)
  //   Backend   → port 5000  (e.g. https://5000-<id>.sandbox.novita.ai)
  //
  // When running locally both services are on localhost, so we fall back to
  // the env-configured value or http://localhost:5000/api/v1.

  if (process.client) {
    const origin = window.location.origin
    const apiBase = origin.includes('sandbox.novita.ai')
      ? origin.replace(/^(https?:\/\/)\d+(-[^.]+\.sandbox\.novita\.ai.*)$/, '$15000$2') + '/api/v1'
      : (process.env.API_BASE_URL || 'http://localhost:5000/api/v1')

    $axios.setBaseURL(apiBase)
  }

  // ── Attach JWT token to every request ───────────────────────────────────
  $axios.onRequest(config => {
    try {
      const token = store.state.token || localStorage.getItem('token')
      if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
      }
    } catch (e) {}
    return config
  })

  // ── Global error handling ────────────────────────────────────────────────
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      try {
        // Fix: clean both Vuex state AND localStorage via store action
        store.dispatch('logout')
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      // Prevent redirect loop if already on signin page
      if (route && route.path && !route.path.includes('/signin')) {
        redirect('/signin')
      }
    }
    return Promise.reject(error)
  })
}
