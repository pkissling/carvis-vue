import * as Sentry from '@sentry/vue'

export function captureMessage(payload) {
  const err = new Error(payload)
  console.error(err)
  captureException(err)
}

export function captureException(exception) {
  Sentry.captureException(exception)
}