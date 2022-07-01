import BaseApi from '@/api/base-api'

export default class AdminUsersApi extends BaseApi {

    public fetchAllUsers = (): Promise<UserDto[]> =>
    this.get('/admin/users')

    public updateUser = (id: string, user: UserDto): Promise<UserDto> =>
        this.put(`/admin/users/${encodeURI(id)}`, user)

    public deleteUser = (id: string): Promise<void> =>
        this.delete(`/admin/users/${encodeURI(id)}`)

    public addUserRoles = (id: string, roles: Role[]): Promise<void> =>
        this.post(`/admin/users/${encodeURI(id)}/roles`, roles)

    public removeUserRoles = (id: string, roles: Role[]): Promise<void> =>
        this.delete(`/admin/users/${encodeURI(id)}/roles`, roles)
}
