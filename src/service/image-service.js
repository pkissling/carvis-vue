import { createUploadUrl, fetchImageUrlBackend } from '../clients/backend-client'
import { uploadFile } from '../clients/s3-client'
import store from '../store'


export async function uploadImage(file, progressCallback, index) {
  const contentType = file.type
  const response = await createUploadUrl(contentType)
  await uploadFile(response.data.url, contentType, file, progressCallback, index)
  return response.data.id
}

export async function fetchImageUrl(imageId, size) {
  return fetchImageUrlBackend(imageId, size).then(response => response.data.url)

  // try {
  //   await store.dispatch('images/fetchImageUrl', { imageId, size })
  // } catch (err) {
  //   store.commit('images/evict', { imageId, size })
  //   return null
  // }
  // const image = store.state.images.cachedImages.find(img => img.imageId === imageId && img.size === size)

  // if (image) {
  //   return image.url
  // }

  // throw new Error('image not found', imageId, size) // TODO check how to use in Promise.catch
}
