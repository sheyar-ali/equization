// middleware/auth.js – Redirect unauthenticated users to signin
export default function ({ store, redirect, localePath }) {
  // Check Vuex store first, then fallback to localStorage
  const token = store.state.token || (process.client ? localStorage.getItem('token') : null)
  if (!token) {
    return redirect(localePath('/signin'))
  }
}
