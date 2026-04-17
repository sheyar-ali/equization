export const state = () => ({
  user: null,
  token: null,
  isAuthenticated: false
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
  }
}

export const actions = {
  // تهيئة الـ auth من localStorage عند تحميل الصفحة
  initAuth({ commit }) {
    try {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        const user = JSON.parse(userStr)
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
      }
    } catch (e) {}
  },

  // تسجيل الدخول
  login({ commit }, { token, user }) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    commit('SET_TOKEN', token)
    commit('SET_USER', user)
  },

  // تحديث بيانات المستخدم (بعد تعديل الملف الشخصي)
  updateUser({ commit }, user) {
    localStorage.setItem('user', JSON.stringify(user))
    commit('SET_USER', user)
  },

  // تسجيل الخروج
  logout({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit('LOGOUT')
  }
}

export const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  token: state => state.token
}
