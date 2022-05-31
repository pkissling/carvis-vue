import BaseApi from '@/api/base-api'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

type UploadRequest = {
    url: string
    uploaded: boolean
}

const uploadQueue: UploadRequest[] = []

const reduceQueue = async (res: AxiosResponse<void>): Promise<AxiosResponse<void>> => {
    if (!res.config.url) {
        return res
    }

    const item = uploadQueue.find((item) => item.url === res.config.url)
    if (!item) {
        return res
    }

    const index = uploadQueue.indexOf(item)
    if (index < 0) {
        return res
    }

    uploadQueue.splice(index, 1, { url: res.config.url, uploaded: true })
    return res
}

const processQueue = async (req: AxiosRequestConfig<void>): Promise<AxiosRequestConfig<void>> => {
    while (
        req.url !==
        uploadQueue
            .filter((item) => item.uploaded === false)
            .map((item) => item.url)[0]
    ) {
        await new Promise((resolve) => setTimeout(resolve, 50))
    }
    return req
}

export default class S3Api extends BaseApi<void> {
    constructor() {
        super(60000, [processQueue], [reduceQueue])
    }

    public async uploadFile(url: string, contentType: string, file: File, progressCallback: (progress: number) => void, index: number): Promise<void> {
        uploadQueue.splice(index, 0, { url, uploaded: false })
        try {
            return await this.put(url, file, {
                headers: {
                    'Content-Type': contentType,
                },
                onUploadProgress: (progressEvent) => {
                    const uploadPercent = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    )
                    progressCallback(uploadPercent)
                },
            })
        } catch (err) {
            // remove item from uploadQueue if upload failed
            uploadQueue.splice(0, 1)
            throw err
        }
    }
}
