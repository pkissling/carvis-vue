import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'
import UsersApi from '@/api/users-api'

config.rawError = true

const usersApi = new UsersApi()

@Module({ namespaced: true, name: 'userManagement' })
export default class UserManagementStore extends VuexModule {
    users: UserDto[] = []
    newUsersCount = 0
    backgroundRefresh: number | null = null

    @Action({ commit: 'setUsers' })
    public async fetchAllUsers(): Promise<UserDto[]> {
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async deleteUser(id: string): Promise<UserDto[]> {
        await usersApi.deleteUser(id)
        await this.fetchNewUsersCount()
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async updateUser({user, addRoles, removeRoles}: { user: UserDto, addRoles?: Role[], removeRoles?: Role[] }): Promise<UserDto[]> {
        await usersApi.updateUser(user.userId, user)
        if (addRoles?.length) {
            await usersApi.addUserRoles(user.userId, addRoles)
        }
        if (removeRoles?.length) {
            await usersApi.removeUserRoles(user.userId, removeRoles)
        }
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async addUserRoles({userId, roles }: { userId: string, roles: Role[] }): Promise<UserDto[]> {
        await usersApi.addUserRoles(userId, roles)
        const users = await usersApi.fetchAllUsers()
        await this.fetchNewUsersCount()
        return users
    }

    @Action({ commit: 'setUsers' })
    public async removeUserRoles({userId, roles }: { userId: string, roles: Role[] }): Promise<UserDto[]> {
        await usersApi.removeUserRoles(userId, roles)
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setNewUsersCount' })
    public async fetchNewUsersCount(): Promise<number> {
        if (!this.backgroundRefresh) {
            this.setBackgroundRefresh({ timerHandler: this.fetchNewUsersCount, delay: 30000 })
        }
        const newCount = await usersApi.fetchNewUsersCount()
        if (newCount !== this.newUsersCount) {
            await this.fetchAllUsers()
        }
        return newCount
    }

    @Mutation
    public setUsers(users: UserDto[]): void {
        this.users = users
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