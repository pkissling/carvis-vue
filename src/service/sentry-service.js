import * as Sentry from '@sentry/vue'

export function captureInfo(payload, extras) {
  captureMessage(payload, extras, 'info')
}

export function captureError(payload, extras) {
  captureMessage(payload, extras, 'error')
}

export function captureMessage(payload, extras, severity) {
  Sentry.withScope(scope => {

    Object.keys(extras).forEach(key => {
      const value = extras[key]
      scope.setExtra(key, value)
    })

    scope.setLevel(severity || 'debug')

    Sentry.captureMessage(payload)
  })
}
