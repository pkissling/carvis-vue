import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { sentryStore } from '@/store'

type Severity = 'success' | 'info' | 'warning' | 'error'

@Module({ namespaced: true, name: 'notifications' })
export default class NotificationsStore extends VuexModule {
    message?: string = undefined
    severity?: Severity = undefined
    show = false

    @Action
    public success(message: string): void {
        this.setMessage(message)
        this.setSeverity('success')
        this.setShow(true)
    }

    @Action
    public info(message: string): void {
        this.setMessage(message)
        this.setSeverity('info')
        this.setShow(true)
    }

    @Action
    public warning(message: string): void {
        this.setMessage(message)
        this.setSeverity('warning')
        this.setShow(true)
    }

    @Action
    public error(dto: { message: string; err?: Error }): void {
        this.setMessage(dto.message)
        this.setSeverity('error')
        this.setShow(true)
        if (dto.err) {
            sentryStore.captureException({ error: dto.err })
        }
    }

    @Action
    public dismiss(): void {
        this.setMessage(undefined)
        this.setSeverity(undefined)
        this.setShow(false)
    }

    public get getMessage(): string | undefined {
        return this.message
    }

    public get getSeverity(): Severity | undefined {
        return this.severity
    }

    public get isShow(): boolean {
        return this.show
    }

    @Mutation
    public setMessage(message?: string): void {
        this.message = message
    }

    @Mutation
    public setSeverity(severity?: Severity): void {
        this.severity = severity
    }

    @Mutation
    public setShow(show: boolean): void {
        this.show = show
    }
}
