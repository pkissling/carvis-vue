import BaseApi from '@/api/base-api'

export default class ImagesApi extends BaseApi {
    public createUploadUrl = (contentType: string): Promise<ImageDto> =>
        this.post('/images', null, {
            headers: {
                'Content-Type': contentType,
            },
        })

    public fetchImage = (
        imageId: string,
        height: ImageHeight
    ): Promise<ImageDto> =>
        this.get(`images/${imageId}`, { params: { height: height.toString() } })
}
