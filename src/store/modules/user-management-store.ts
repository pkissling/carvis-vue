import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { config } from 'vuex-module-decorators'
import { notificationsStore } from '@/store'
import AdminUsersApi from '@/api/admin-users-api'

config.rawError = true

const adminUsersApi = new AdminUsersApi()

@Module({ namespaced: true, name: 'userManagement' })
export default class UserManagementStore extends VuexModule {
    users: UserDto[] = []

    @Action({ commit: 'setUsers' })
    public async fetchAllUsers(): Promise<UserDto[]> {
        return await adminUsersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async deleteUser(id: string): Promise<UserDto[]> {
        await adminUsersApi.deleteUser(id)
        await notificationsStore.fetchNewUsersCount()
        return await adminUsersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async updateUser({user, addRoles, removeRoles}: { user: UserDto, addRoles?: Role[], removeRoles?: Role[] }): Promise<UserDto[]> {
        await adminUsersApi.updateUser(user.userId, user)
        if (addRoles?.length) {
            await adminUsersApi.addUserRoles(user.userId, addRoles)
        }
        if (removeRoles?.length) {
            await adminUsersApi.removeUserRoles(user.userId, removeRoles)
        }
        return await adminUsersApi.fetchAllUsers()
    }

    @Action({ commit: 'setUsers' })
    public async addUserRoles({userId, roles }: { userId: string, roles: Role[] }): Promise<UserDto[]> {
        await adminUsersApi.addUserRoles(userId, roles)
        const users = await adminUsersApi.fetchAllUsers()
        await notificationsStore.fetchNewUsersCount()
        return users
    }

    @Action({ commit: 'setUsers' })
    public async removeUserRoles({userId, roles }: { userId: string, roles: Role[] }): Promise<UserDto[]> {
        await adminUsersApi.removeUserRoles(userId, roles)
        return await adminUsersApi.fetchAllUsers()
    }

    @Mutation
    public setUsers(users: UserDto[]): void {
        this.users = users
    }
}
