import BaseApi from '@/api/base-api'

export default class UsersApi extends BaseApi {

    public fetchUser = (id: string): Promise<UserDto> =>
        this.get(`/users/${id}`)

    public updateUser = (id: string, user: UserDto): Promise<UserDto> =>
        this.put(`/users/${id}`, user)
}
