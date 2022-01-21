import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

const env = (): string => {
    if (process.env.NODE_ENV === 'development') {
        return 'local'
    }

    if (process.env.VUE_APP_USE_DEV === 'true') {
        return 'dev'
    }

    return 'live'
}

export default () => {
    Sentry.init({
        Vue,
        dsn: 'https://d6e0397557fd4cefb61c460d0b0e4797@o582664.ingest.sentry.io/5736641',
        integrations: [
            new Integrations.BrowserTracing({
                tracingOrigins: ['api.carvis.cloud', 'api.dev.carvis.cloud'],
            }),
        ],
        tracesSampleRate: 0.2,
        release: process.env.npm_package_version,
        environment: env(),
    })
}
