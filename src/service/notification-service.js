import store from "../store";

export default class NotificationService {

  static async info(message) {
    store.dispatch('notifications/info', message)
  }

  static async success(message) {
    store.dispatch('notifications/success', message)
  }

  static async warning(message) {
    store.dispatch('notifications/warning', message)
  }

  static async error(message) {
    store.dispatch('notifications/error', message)
  }
}

