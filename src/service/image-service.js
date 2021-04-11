import { createUploadUrl, fetchImageUrl } from '../clients/backend-client'
import { uploadFile } from '../clients/s3-client'

export default class ImageService {

  static async uploadImage(file) {
    const contentType = file.type
    const response = await createUploadUrl(contentType)
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
    return fetchImageUrl(imageId, size)
  }
}