import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule,
} from 'vuex-module-decorators'
import * as Sentry from '@sentry/vue'
import { Severity } from '@sentry/vue'
import { User } from '@/auth/user'

@Module({ namespaced: true, name: 'sentry' })
export default class SentryStore extends VuexModule {
    @Action
    public async removeUser(): Promise<void> {
        Sentry.setUser(null)
    }

    @Action
    public async addUser(user: User): Promise<void> {
        Sentry.setUser({
            id: user.sub,
            email: user.email,
        })
    }

    @Action
    public async captureInfo(dto: {
        payload: string
        extras?: any
    }): Promise<void> {
        this.captureMessage({
            payload: dto.payload,
            extras: dto.extras,
            severity: Severity.Info,
        })
    }

    @Action
    public async captureError(dto: {
        payload: string
        extras?: any
    }): Promise<void> {
        this.captureMessage({
            payload: dto.payload,
            extras: dto.extras,
            severity: Severity.Error,
        })
    }

    @Action
    public async captureException(dto: {
        error: Error
        extras?: any
    }): Promise<void> {
        send(
            (p) => Sentry.captureException(p),
            Severity.Error,
            dto.error,
            dto.extras
        )
    }

    @Action
    public async captureMessage(dto: {
        payload: string
        extras?: any
        severity: Severity
    }): Promise<void> {
        send(
            (p) => Sentry.captureMessage(p),
            dto.severity || Severity.Debug,
            dto.payload,
            dto.extras
        )
    }
}

const send = (
    sendFn: (payload: any) => void,
    severity: Severity,
    payload: string | Error,
    extras: any = ''
): void => {
    if (process.env.NODE_ENV === 'development') {
        if (severity === 'error') {
            console.error('SENTRY: ' + payload, extras)
        } else {
            console.log('SENTRY: ' + payload, extras)
        }
    }

    Sentry.withScope((scope) => {
        if (extras) {
            Object.keys(extras).forEach((key) => {
                const value = extras[key]
                scope.setExtra(key, value ? JSON.stringify(value) : undefined)
            })
        }
        scope.setLevel(severity)

        sendFn(payload)
    })
}
