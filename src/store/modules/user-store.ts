import { User } from '@/auth/user'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { sentryStore } from '@/store'
import { config } from 'vuex-module-decorators'

config.rawError = true

type Role = 'admin' | 'user'

@Module({ namespaced: true, name: 'user' })
export default class UserStore extends VuexModule {
    user: User | undefined = undefined

    @Action
    public async processLogin(user?: User): Promise<void> {
        if (user) {
            sentryStore.addUser(user)
        } else {
            sentryStore.removeUser()
        }
        this.setUser(user)
    }

    @Action
    public async processLogout(): Promise<void> {
        sentryStore.removeUser()
        this.setUser(undefined)
    }

    public get getUsername(): string | undefined {
        return this.user?.sub
    }

    public get getName(): string | undefined {
        return this.user?.name
    }

    public get getPicture(): string | undefined {
        return this.user?.picture
    }

    public get isAdmin(): boolean {
        return hasRole(this.user, 'admin')
    }

    public get isUser(): boolean {
        return hasRole(this.user, 'user')
    }

    public get hasAccess(): boolean {
        return this.isAdmin || this.isUser
    }

    public get getUser(): User | undefined {
        return this.user
    }

    @Mutation
    public setUser(user?: User): void {
        this.user = user
    }
}

export const hasRole = (
    user: User | undefined,
    requiredRole: Role
): boolean => {
    if (!user) {
        return false
    }

    const roles = user.roles || []
    return roles.some((role) => role === requiredRole)
}
