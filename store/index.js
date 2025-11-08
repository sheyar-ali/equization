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
  // Initialize auth state from cookies/localStorage
  async nuxtServerInit({ commit }, { req, app }) {
    const token = app.$cookies.get('token')
    if (token) {
      commit('SET_TOKEN', token)
      try {
        const { data } = await this.$api.auth.getMe()
        commit('SET_USER', data.user)
      } catch (error) {
        commit('LOGOUT')
        app.$cookies.remove('token')
      }
    }
  },

  // Login action
  async login({ commit }, credentials) {
    try {
      const { data } = await this.$api.auth.login(credentials)
      
      // Store token
      this.$cookies.set('token', data.data.token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
      
      commit('SET_TOKEN', data.data.token)
      commit('SET_USER', data.data.user)
      
      return { success: true, data: data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  },

  // Register action
  async register({ commit }, userData) {
    try {
      const { data } = await this.$api.auth.register(userData)
      
      // Store token
      this.$cookies.set('token', data.data.token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      })
      
      commit('SET_TOKEN', data.data.token)
      commit('SET_USER', data.data.user)
      
      return { success: true, data: data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    }
  },

  // Logout action
  logout({ commit }) {
    commit('LOGOUT')
    this.$cookies.remove('token')
    localStorage.removeItem('token')
  },

  // Update user details
  async updateUser({ commit }, userData) {
    try {
      const { data } = await this.$api.auth.updateDetails(userData)
      commit('SET_USER', data.data.user)
      return { success: true, data: data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      }
    }
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.isAuthenticated
  },
  
  user(state) {
    return state.user
  },
  
  token(state) {
    return state.token
  }
}
