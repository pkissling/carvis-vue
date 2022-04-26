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

    @Mutation
    public setUsers(users: UserDto[]): void {
        this.users = users
    }
}
