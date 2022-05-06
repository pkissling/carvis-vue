import BaseApi from '@/api/base-api'

export default class UsersApi extends BaseApi {

    public fetchMyUser = (): Promise<UserDto> =>
        this.get('/my-user')

    public fetchUser = (id: string): Promise<UserDto> =>
        this.get(`/users/${encodeURI(id)}`)

    public fetchAllUsers = (): Promise<UserDto[]> =>
        this.get('/users')

    public updateUser = (id: string, user: UserDto): Promise<UserDto> =>
        this.put(`/users/${encodeURI(id)}`, user)

    public deleteUser = (id: string): Promise<void> =>
        this.delete(`/users/${encodeURI(id)}`)

    public addUserRoles = (id: string, roles: Role[]): Promise<void> =>
        this.post(`/users/${encodeURI(id)}/roles`, roles)

    public removeUserRoles = (id: string, roles: Role[]): Promise<void> =>
        this.delete(`/users/${encodeURI(id)}/roles`, roles)

}
