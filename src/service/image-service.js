import { createUploadUrl } from '../clients/backend-client'
import { uploadFile } from '../clients/s3-client'

export default class ImageService {

  static async uploadImage(file) {
    const contentType = file.type
    return createUploadUrl(contentType)
      .then(resp => {
        uploadFile(resp.data.url, contentType, file)
        return resp.data.id
      })
      .catch(err => console.log(err)) // TODO
  }

  static async createUploadUrl(file) {
    return createUploadUrl(file.type)
      .then(resp => resp.data)
  }

  static async uploadFile(file) {
    return uploadFile(file.url)
  }
}