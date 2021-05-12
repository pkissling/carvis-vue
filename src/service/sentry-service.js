import * as Sentry from '@sentry/vue'

export default {

  captureInfo(payload, extras) {
    captureMessage(payload, extras, 'info')
  },

  captureError(payload, extras) {
    captureMessage(payload, extras, 'error')
  },

  captureMessage(payload, extras, severity) {
    if (process.env.NODE_ENV === 'development') {
      console.log(payload, extras)
    }

    Sentry.withScope(scope => {

      Object.keys(extras).forEach(key => {
        const value = extras[key]
        scope.setExtra(key, value)
      })

      scope.setLevel(severity || 'debug')

      Sentry.captureMessage(payload)
    })
  }
}
