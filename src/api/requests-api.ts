import BaseApi from '@/api/base-api'

export default class RequestsApi extends BaseApi {
    public fetchAllRequests = (): Promise<RequestDto[]> => this.get('/requests')

    public fetchRequest = (id: string): Promise<RequestDto> =>
        this.get(`/requests/${id}`)

    public createRequest = (request: RequestDto): Promise<void> =>
        this.post('/requests', request)

    public updateRequest = (id: string, request: RequestDto): Promise<void> =>
        this.put(`/requests/${id}`, request)

    public deleteRequest = (id: string): Promise<void> =>
        this.delete(`/requests/${id}`)
}
