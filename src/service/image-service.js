import { createUploadUrl, fetchImageUrl } from '../clients/backend-client'
import { uploadFile } from '../clients/s3-client'

export default class ImageService {

  static async uploadImage(file) {
    const contentType = file.type
    const response = await createUploadUrl(contentType) // TODO
    await uploadFile(response.data.url, contentType, file)
    return response.data.id
  }

  static async createUploadUrl(file) {
    return createUploadUrl(file.type)
      .then(resp => resp.data)
  }

  static async uploadFile(file) {
    return uploadFile(file.url)
  }

  static async fetchImageUrl(imageId, size) {
    // TODO check size param everywhere!
    // TODO cache!

    const width = size ? size / 2 : 1000
    const height = Math.round(width / 2)
    const id = Math.floor(Math.random() * 100) + 1
    return `https://picsum.photos/${width}/${height}?image=${id}`
    return fetchImageUrl(imageId, size)
  }
}