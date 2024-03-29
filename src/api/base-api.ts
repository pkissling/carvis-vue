import { obtainJwtToken } from '@/auth/utils'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import axiosRetry from 'axios-retry'
import { apiUrl } from '../../carvis.config'

export default abstract class BaseApi<T = unknown> {
    private readonly instance: AxiosInstance

    constructor(
        timeout = 10000,
        requestInterceptors: ((value: AxiosRequestConfig<T>) => Promise<AxiosRequestConfig<T>>)[] = [],
        reponseInterceptors: ((data: AxiosResponse<T>) => Promise<AxiosResponse<T>>)[] = [],
        anonymous = false
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
        if (!anonymous) {
            this.instance.interceptors.request.use(this.addAuthHeader)
        }

        // generic response interceptors
        this.instance.interceptors.response.use(this.extractPayload)
    }

    protected get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        this.send('GET', url, config)

    protected post = <T>(url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> =>
        this.send('POST', url, config, payload)

    protected put = <T>(url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> =>
        this.send('PUT', url, config, payload)

    protected delete = (url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<void> =>
        this.send('DELETE', url, config, payload)

    private send = async <T>(method: Method, url: string, config?: AxiosRequestConfig, payload?: unknown): Promise<T> => {
        const req = { method, url, data: payload, ...config }
        return await this.instance.request(req)
    }

    private addAuthHeader = async (request: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        const token = await obtainJwtToken()
        if (token && request.headers) {
            request.headers['Authorization'] = `Bearer ${token}`
        }

        return request
    }

    private extractPayload = (response?: AxiosResponse<T>): T | undefined => {
        return response?.data
    }
}
