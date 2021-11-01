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
      if (severity === 'error') {
        console.error('SENTRY: ' + payload, extras)
      } else {
        console.log('SENTRY: ' + payload, extras)
      }
    }

    Sentry.withScope(scope => {

      if (extras) {
        Object.keys(extras).forEach(key => {
          const value = extras[key]
          scope.setExtra(key, value ? JSON.stringify(value) : undefined)
        })
      }
      scope.setLevel(severity || 'debug')

      sendFn(payload)
    })
  }
}
