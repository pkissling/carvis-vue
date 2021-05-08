import * as Sentry from '@sentry/vue'

export function captureMessage(payload, extras) {
  const err = new Error(payload)
  console.error(err, extras)
  captureException(err, extras)
}

export function captureException(exception, extras) {
  if (!extras) {
    Sentry.captureException(exception)
  }

  Sentry.withScope(scope => {
    Object.keys(extras).forEach(key => {
      const value = extras[key]
      scope.setExtra(key, value)
    })
    Sentry.captureException(exception)
  })
}