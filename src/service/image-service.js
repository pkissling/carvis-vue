import { createUploadUrl } from '../clients/backend-client'
import { uploadFile } from '../clients/s3-client'
import { captureError, captureInfo } from './sentry-service'
import store from '../store'

export async function uploadImage(file, progressCallback, index) {
  const contentType = file.type
  const response = await createUploadUrl(contentType)
  await uploadFile(response.data.url, contentType, file, progressCallback, index)
  return response.data.id
}

export async function reloadImage(imageId, size) {
  console.log('reload triggered', imageId, size)

  store.commit('images/evictOne', { imageId, size })
  const url = await fetchImageUrl(imageId, size)

  const loads = await imageLoads(url)
  if (!loads) {
    captureError('Reloaded url was invalid as well!', { url })
    throw new Error('Cannot resolve image from url', url)
  }

  captureInfo('Successfully reloaded expired image.', { url })
  return url
}

export async function imageLoads(url) {
  console.log('imageLoads', url)

  const result = await new Promise(resolve => {
    const image = new Image()
    image.onload = resolve
    image.onerror = resolve
    image.src = url
  })

  return result.type === 'load'
}

export async function fetchImageUrl(imageId, size) {

  await store.dispatch('images/purgeExpired')
  try {
    await store.dispatch('images/fetchImageUrl', { imageId, size })
  } catch (err) {
    console.error(err)
    store.commit('images/evictOne', { imageId, size })
    throw new Error('unable to fetch image', imageId, err)
  }
  const image = store.state.images.cachedImages.find(img => img.imageId === imageId && img.size === size)

  if (!image || !image.url) {
    throw new Error('image not found', imageId, size) // TODO check how to use in Promise.catch
  }

  return image.url
}
