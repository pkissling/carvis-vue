import backendClient from '../clients/backend-client'
import s3Client from '../clients/s3-client'
import sentryService from './sentry-service'
import store from '../store'
import notificationService from './notification-service'

export default {

  async uploadImage(file, progressCallback, index) {
    const contentType = file.type
    const response = await backendClient.createUploadUrl(contentType)
    await s3Client.uploadFile(response.data.url, contentType, file, progressCallback, index)
    return response.data.id
  },

  async reloadImage(imageId, size) {
    store.commit('images/evictOne', { imageId, size })
    const url = await this.fetchImageUrl(imageId, size)

    const loads = await this.imageLoads(url)
    if (!loads) {
      notificationService.warning('Ein Bild konnte nicht geladen werden. Bitte versuche es später erneut.')
      sentryService.captureError('Reloaded url was invalid as well!', { url })
      throw new Error('Cannot resolve image from url', url)
    }

    return url
  },

  async imageLoads(url) {
    const result = await new Promise(resolve => {
      const image = new Image()
      image.onload = resolve
      image.onerror = resolve
      image.src = url
    })

    return result.type === 'load'
  },

  async fetchImageUrl(imageId, size) {

    await store.dispatch('images/purgeExpired')
    try {
      await store.dispatch('images/fetchImageUrl', { imageId, size })
    } catch (err) {
      store.commit('images/evictOne', { imageId, size })
      notificationService.warning('Ein Bild konnte nicht geladen werden. Bitte versuche es später erneut.')
      sentryService.captureException(err, { imageId, size })
      throw new Error('unable to fetch image', imageId, err)
    }
    const image = store.getters['images/getImage'](imageId, size)
    if (!image || !image.url) {
      const err = new Error('image not found', imageId, size)
      notificationService.warning('Ein Bild konnte nicht geladen werden. Bitte versuche es später erneut.')
      sentryService.captureException(err, { imageId, size })
      throw err
    }

    return image.url
  }
}
