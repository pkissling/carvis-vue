import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import RequestsApi from '@/api/requests-api'

const requestsApi = new RequestsApi()

@Module({ namespaced: true, name: 'requests' })
export default class RequestsStore extends VuexModule {
    requests: RequestDto[] = []
    searchTerm = ''

    @Action({ commit: 'putAll' })
    public async fetchAllRequests(): Promise<RequestDto[]> {
        return requestsApi.fetchAllRequests()
    }

    @Action({ commit: 'put' })
    public async fetchRequest(requestId: string): Promise<RequestDto> {
        return requestsApi.fetchRequest(requestId)
    }

    @Action
    public async createRequest(request: RequestDto): Promise<void> {
        await requestsApi.createRequest(request)
        await this.fetchAllRequests()
    }

    @Action
    public async updateRequest(request: RequestDto): Promise<void> {
        await requestsApi.updateRequest(request.id, request)
        await this.fetchAllRequests()
    }

    @Action
    public async deleteRequest(requestId: string): Promise<void> {
        await requestsApi.deleteRequest(requestId)
        await this.fetchAllRequests()
    }

    @Mutation
    putAll(requests: RequestDto[]): void {
        this.requests = requests
    }

    @Mutation
    put(request: RequestDto): void {
        this.requests = [
            ...this.requests.filter((c) => c.id !== request.id),
            request,
        ]
    }

    @Mutation
    setSearchTerm(searchTerm: string): void {
        this.searchTerm = searchTerm
    }
}
