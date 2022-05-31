import { Action, Module, VuexModule } from 'vuex-module-decorators'
import * as Sentry from '@sentry/vue'
import { SeverityLevel } from '@sentry/vue'
import { Auth0User } from '@/auth/user'
import { config } from 'vuex-module-decorators'

config.rawError = true

type SentryExtra = {
    [key: string]: unknown
}

@Module({ namespaced: true, name: 'sentry' })
export default class SentryStore extends VuexModule {
    @Action
    public async removeUser(): Promise<void> {
        Sentry.setUser(null)
    }

    @Action
    public async addUser(user: Auth0User): Promise<void> {
        Sentry.setUser({
            id: user.sub,
            email: user.email,
        })
    }

    @Action
    public async captureInfo(dto: {
        payload: string
        extras?: SentryExtra
    }): Promise<void> {
        this.captureMessage({
            payload: dto.payload,
            extras: dto.extras,
            severity: 'info',
        })
    }

    @Action
    public async captureError(dto: {
        payload: string
        extras?: SentryExtra
    }): Promise<void> {
        this.captureMessage({
            payload: dto.payload,
            extras: dto.extras,
            severity: 'error',
        })
    }

    @Action
    public async captureException(dto: {
        error: Error
        extras?: SentryExtra
    }): Promise<void> {
        send(
            (p) => Sentry.captureException(p),
            'error',
            dto.error,
            dto.extras
        )
    }

    @Action
    public async captureMessage(dto: {
        payload: string
        extras?: SentryExtra
        severity: SeverityLevel
    }): Promise<void> {
        send(
            (p) => Sentry.captureMessage(p),
            dto.severity || 'debug',
            dto.payload,
            dto.extras
        )
    }
}

const send = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendFn: (payload: any) => void,
    severity: SeverityLevel,
    payload: string | Error,
    extras?: SentryExtra
): void => {
    if (process.env.NODE_ENV === 'development') {
        if (severity === 'error') {
            // eslint-disable-next-line no-console
            console.error('SENTRY: ' + payload, extras)
        } else {
            // eslint-disable-next-line no-console
            console.log('SENTRY: ' + payload, extras)
        }
    }

    Sentry.withScope((scope) => {
        if (extras) {
            Object.keys(extras).forEach(key => {
                const value = extras[key]
                scope.setExtra(key, value ? JSON.stringify(value) : undefined)
            })
        }
        scope.setLevel(severity)

        sendFn(payload)
    })
}
