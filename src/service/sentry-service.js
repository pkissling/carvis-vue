import * as Sentry from '@sentry/vue'

export default {

  captureInfo(payload, extras) {
    this.captureMessage(payload, extras, 'info')
  },

  captureError(payload, extras) {
    this.captureMessage(payload, extras, 'error')
  },

  captureException(error, extras) {
    this.send((p) => Sentry.captureException(p), 'error', error, extras)
  },

  captureMessage(payload, extras, severity) {
    this.send((p) => Sentry.captureMessage(p), severity, payload, extras)
  },

  send(sendFn, severity, payload, extras) {
    if (process.env.NODE_ENV === 'development') {
      console.log(payload, extras)
    }

    Sentry.withScope(scope => {

      Object.keys(extras).forEach(key => {
        const value = extras[key]
        scope.setExtra(key, value)
      })

      scope.setLevel(severity || 'debug')

      sendFn(payload)
    })
  }
}
