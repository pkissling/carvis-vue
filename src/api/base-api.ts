import { obtainJwtToken } from '@/auth/utils'
import { commonStore } from '@/store'
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    Method,
} from 'axios'
import axiosRetry from 'axios-retry'
import { apiUrl } from '../../carvis.config'

export default abstract class BaseApi {
    private readonly instance: AxiosInstance

    constructor(
        timeout = 10000,
        requestInterceptors: ((data: any) => Promise<any>)[] = [],
        reponseInterceptors: ((
            data: AxiosResponse<any>
        ) => Promise<AxiosResponse<any>>)[] = []
    ) {
        this.instance = axios.create({ baseURL: apiUrl(), timeout })

        axiosRetry(this.instance, {
            retryDelay: axiosRetry.exponentialDelay,
            shouldResetTimeout: true
        })

        // custom interceptors
        requestInterceptors.forEach((interceptor) =>
            this.instance.interceptors.request.use(interceptor)
        )
        reponseInterceptors.forEach((interceptor) =>
            this.instance.interceptors.response.use(interceptor)
        )

        // generic request interceptors
        this.instance.interceptors.request.use(this.addAuthHeader)

        // generic response interceptors
        this.instance.interceptors.response.use(this.extractPayload)
    }

    protected get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        this.send('GET', url, config)

    protected post = <T>(
        url: string,
        payload?: any,
        config?: AxiosRequestConfig
    ): Promise<T> => this.send('POST', url, config, payload)

    protected put = <T>(
        url: string,
        payload?: any,
        config?: AxiosRequestConfig
    ): Promise<T> => this.send('PUT', url, config, payload)

    protected delete = (
        url: string,
        config?: AxiosRequestConfig
    ): Promise<void> => this.send('DELETE', url, config)

    private send = async <T>(
        method: Method,
        url: string,
        config?: AxiosRequestConfig,
        payload?: any
    ): Promise<T> => {
        commonStore.setLoading(true)
        try {
            const req = { method, url, data: payload, ...config }
            return await this.instance.request(req)
        } finally {
            commonStore.setLoading(false)
        }
    }

    private addAuthHeader = async (
        request: AxiosRequestConfig
    ): Promise<AxiosRequestConfig> => {
        const requiresAuth = !request.url?.startsWith('https://')
        if (!requiresAuth) {
            return request
        }

        const token = await obtainJwtToken()
        request.headers.Authorization = `Bearer ${token}`
        return request
    }

    private extractPayload = (response?: AxiosResponse): any | undefined => {
        return response?.data
    }
}
