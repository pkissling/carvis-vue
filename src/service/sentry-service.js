import * as Sentry from '@sentry/vue'

export function captureMessage(payload, extras) {
  Sentry.withScope(scope => {

    Object.keys(extras).forEach(key => {
      const value = extras[key]
      scope.setExtra(key, value)
    })

    scope.setLevel('info')

    Sentry.captureMessage(payload)
  })
}
