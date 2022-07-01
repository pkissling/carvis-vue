import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { sentryStore, userManagementStore } from '@/store'
import { config } from 'vuex-module-decorators'
import NotificationsApi from '@/api/notifications-api'

config.rawError = true

type Severity = 'success' | 'info' | 'warning' | 'error'
const notificationsApi = new NotificationsApi()

@Module({ namespaced: true, name: 'notifications' })
export default class NotificationsStore extends VuexModule {
    message?: string = undefined
    severity?: Severity = undefined
    show = false
    newUsersCount = 0
    backgroundRefresh: number | null = null

    @Action
    public async success(message: string): Promise<void> {
        this.setMessage(message)
        this.setSeverity('success')
        this.setShow(true)
    }

    @Action
    public async info(message: string): Promise<void> {
        this.setMessage(message)
        this.setSeverity('info')
        this.setShow(true)
    }

    @Action
    public async warning(message: string): Promise<void> {
        this.setMessage(message)
        this.setSeverity('warning')
        this.setShow(true)
    }

    @Action
    public async error(dto: { message: string; err?: Error }): Promise<void> {
        this.setMessage(dto.message)
        this.setSeverity('error')
        this.setShow(true)
        if (dto.err) {
            await sentryStore.captureException({ error: dto.err })
        }
    }

    @Action
    public async dismiss(): Promise<void> {
        this.setMessage(undefined)
        this.setSeverity(undefined)
        this.setShow(false)
    }

    @Action({ commit: 'setNewUsersCount' })
    public async fetchNewUsersCount(): Promise<number> {
        if (!this.backgroundRefresh) {
            this.setBackgroundRefresh({ timerHandler: this.fetchNewUsersCount, delay: 30000 })
        }
        const newCount = await notificationsApi.fetchNewUsersCount()
        if (newCount !== this.newUsersCount) {
            await userManagementStore.fetchAllUsers()
        }
        return newCount
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

    @Mutation
    public setNewUsersCount(newUsersCount: number): void {
        this.newUsersCount = newUsersCount
    }

    @Mutation
    public setBackgroundRefresh({ timerHandler, delay }: { timerHandler: TimerHandler, delay: number }): void {
        this.backgroundRefresh = setInterval(timerHandler, delay)
    }
}
