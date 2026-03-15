export default function ({ $axios, redirect }) {
  // لا نحتاج setBaseURL - @nuxtjs/axios يقرأ browserBaseURL من nuxt.config.js تلقائياً

  // إضافة التوكن لكل طلب
  $axios.onRequest(config => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
      }
    } catch (e) {}
    return config
  })

  // معالجة الأخطاء
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (e) {}
      redirect('/signin')
    }
    return Promise.reject(error)
  })
}
