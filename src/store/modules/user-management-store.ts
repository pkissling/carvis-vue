import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'
import UsersApi from '@/api/users-api'

config.rawError = true

const usersApi = new UsersApi()

@Module({ namespaced: true, name: 'userManagement' })
export default class UserManagementStore extends VuexModule {
    users: UserDto[] = []
    newUsersCount = 0

    @Action({ commit: 'setUsers' })
    public async fetchAllUsers(): Promise<UserDto[]> {
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async deleteUser(id: string): Promise<UserDto[]> {
        await usersApi.deleteUser(id)
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async updateUser(user: UserDto): Promise<UserDto[]> {
        await usersApi.updateUser(user.userId, user)
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async addUserRoles({id, roles }: { id: string, roles: Role[] }): Promise<UserDto[]> {
        await usersApi.addUserRoles(id, roles)
        const users = await usersApi.fetchAllUsers()
        await this.fetchNewUsersCount()
        return users
    }

    @Action({ commit: 'setUsers' })
    public async removeUserRoles({id, roles }: { id: string, roles: Role[] }): Promise<UserDto[]> {
        await usersApi.removeUserRoles(id, roles)
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setNewUsersCount' })
    public async fetchNewUsersCount(): Promise<number> {
        // TODO timer
        return await usersApi.fetchNewUsersCount()
    }

    @Mutation
    public setUsers(users: UserDto[]): void {
        this.users = users
    }

    @Mutation
    public setNewUsersCount(newUsersCount: number): void {
        this.newUsersCount = newUsersCount
    }
}
