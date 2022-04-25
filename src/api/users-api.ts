import BaseApi from '@/api/base-api'

export default class UsersApi extends BaseApi {

    public fetchMyUser = (): Promise<UserDto> =>
        this.get('/my-user')

    public fetchUser = (id: string): Promise<UserDto> =>
        this.get(`/users/${encodeURI(id)}`)

    public updateUser = (id: string, user: UserDto): Promise<UserDto> =>
        this.put(`/users/${encodeURI(id)}`, user)
}
