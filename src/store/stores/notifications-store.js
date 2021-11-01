export default {
  namespaced: true,
  state: {
    message: '',
    color: ''
  },
  mutations: {
    showMessage(state, payload) {
      state.message = payload.message
      state.color = payload.color
    }
  },
  actions: {
    success(context, message) {
      context.commit('showMessage', { color: 'success', message })
    },
    info(context, message) {
      context.commit('showMessage', { color: 'info', message })
    },
    warning(context, message) {
      context.commit('showMessage', { color: 'warning', message })
    },
    error(context, message) {
      context.commit('showMessage', { color: 'error', message })
    }
  }
}
