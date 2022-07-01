import BaseApi from '@/api/base-api'

export default class NotificationsApi extends BaseApi {

    public fetchNewUsersCount = (): Promise<number> =>
        this.get('/notifications/new-users-count')

}
