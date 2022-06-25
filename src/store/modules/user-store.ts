import { Auth0User } from '@/auth/user'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { sentryStore } from '@/store'
import { config } from 'vuex-module-decorators'
import UsersApi from '@/api/users-api'

config.rawError = true

const usersApi = new UsersApi()

@Module({ namespaced: true, name: 'user' })
export default class UserStore extends VuexModule {
    auth0User: Auth0User | null = null
    carvisUser: UserDto | null = null

    @Action
    public async processLogin(user: Auth0User): Promise<void> {
        await sentryStore.addUser(user)
        this.setAuth0User(user)
    }

    @Action
    public async processLogout(): Promise<void> {
        sentryStore.removeUser()
        this.setAuth0User(null)
    }

    @Action({ commit: 'setCarvisUser' })
    public async updateCarvisUser(user: UserDto): Promise<UserDto> {
        const updatedUser = await usersApi.updateUser(user.userId, user)
        this.setAuth0User({
            ...this.auth0User,
            name: user.name
        })
        return updatedUser
    }

    @Action({ commit: 'setCarvisUser' })
    public async fetchCarvisUser(): Promise<UserDto> {
        return await usersApi.fetchMyUser()
    }

    public get getUserId(): string | undefined {
        return this.auth0User?.sub
    }

    public get getName(): string | undefined {
        return this.auth0User?.name
    }

    public get getPicture(): string | undefined {
        return this.auth0User?.picture
    }

    public get getCompany(): string | undefined {
        return this.carvisUser?.company
    }

    public get isAdmin(): boolean {
        return hasRole(this.auth0User, 'admin')
    }

    public get isUser(): boolean {
        return hasRole(this.auth0User, 'user')
    }

    public get hasAccess(): boolean {
        return this.isAdmin || this.isUser
    }

    @Mutation
    public setAuth0User(auth0User: Auth0User | null): void {
        this.auth0User = auth0User
    }

    @Mutation
    public setCarvisUser(carvisUser: UserDto | null): void {
        this.carvisUser = carvisUser
    }
}

export const hasRole = (
    user: Auth0User | null,
    requiredRole: Role | undefined
): boolean => {
    if (!user) {
        return false
    }
    if (!requiredRole) {
        return true
    }

    const roles = user.roles || []
    return roles.some(role => role === requiredRole)
}
