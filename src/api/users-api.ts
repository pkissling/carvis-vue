import BaseApi from '@/api/base-api'

export default class UsersApi extends BaseApi {

    public fetchMyUser = (): Promise<UserDto> =>
        this.get('/my-user')

    public updateUser = (id: string, user: UserDto): Promise<UserDto> =>
        this.put(`/users/${id}`, user)
}
