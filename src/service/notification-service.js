import store from '../store'

export default {

  async info(message) {
    store.dispatch('notifications/info', message)
  },

  async success(message) {
    store.dispatch('notifications/success', message)
  },

  async warning(message) {
    store.dispatch('notifications/warning', message)
  },

  async error(message) {
    store.dispatch('notifications/error', message)
  }
}

