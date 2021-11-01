import store from '../store'
import sentryService from './sentry-service'

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

  async error(message, err) {
    if (err) {
      sentryService.captureException(err)
    }
    store.dispatch('notifications/error', message)
  }
}

