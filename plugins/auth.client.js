// يُشغَّل في المتصفح فقط - يُهيّئ Vuex store من localStorage
export default ({ store }) => {
  store.dispatch('initAuth')
}
