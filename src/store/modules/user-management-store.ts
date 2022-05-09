import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'
import UsersApi from '@/api/users-api'

config.rawError = true

const usersApi = new UsersApi()

@Module({ namespaced: true, name: 'userManagement' })
export default class UserManagementStore extends VuexModule {
    users: UserDto[] = []

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
        return await usersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async removeUserRoles({id, roles }: { id: string, roles: Role[] }): Promise<UserDto[]> {
        await usersApi.removeUserRoles(id, roles)
        return await usersApi.fetchAllUsers()
    }

    @Mutation
    public setUsers(users: UserDto[]): void {
        this.users = users
    }
}
