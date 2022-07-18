import BaseApi from '@/api/base-api'

export default class AdminShareableLinksApi extends BaseApi {

    public fetchAllShareableLinks = (): Promise<ShareableLinkDto[]> =>
        this.get('/admin/shareable-links')

    public deleteShareableLink = (reference: string): Promise<void> =>
        this.delete(`/admin/shareable-links/${encodeURI(reference)}`)

    public generateShareableLink = (carId: string, recipientName: string): Promise<ShareableLinkDto> =>
        this.post(`/admin/cars/${carId}/shareable-links`, { recipientName })
}
