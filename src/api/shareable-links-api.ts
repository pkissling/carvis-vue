import BaseApi from '@/api/base-api'

export default class ShareableLinksApi extends BaseApi {

    constructor() {
        super(10000, [], [], true)
    }

    public fetchCarByShareableLinkReference = (reference: string): Promise<CarDto> =>
        this.get(`/shareable-links/${encodeURI(reference)}/car`)

    public fetchImageFromShareableLinkReference = (reference: string, imageId: string, height: ImageHeight): Promise<ImageDto> =>
        this.get(`/shareable-links/${encodeURI(reference)}/images/${imageId}`, { params: { height: height.toString() } })
}
