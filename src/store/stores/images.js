import backendClient from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    cachedImages: [],
  },
  mutations: {
    put(state, image) {
      console.log('put', image.imageId, image.size)

      // remove otherwise duplicated images in cache
      const duplicatedImages = state.cachedImages.filter(img => img.imageId === image.imageId && img.size === image.size)
      while (duplicatedImages.length) {
        console.log('removing otherwise duplicated image', duplicatedImages[duplicatedImages.length - 1])
        state.cachedImages.splice(duplicatedImages.pop(), 1);
      }

      // populate new entry
      console.log('before put', state.cachedImages.length)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 5) // + 5 day
      const putImage = { ...image, expiresAt }
      state.cachedImages.push(putImage)
      console.log('after put', state.cachedImages.length)
    },
    evictOne(state, { imageId, size }) {
      console.log('evictOne', imageId, size)
      console.log('before evictOne length = ', state.cachedImages.length)
      state.cachedImages = state.cachedImages.filter(img => img.imageId !== imageId && img.size !== size)
      console.log('after evictOne length = ', state.cachedImages.length)
    },
    evictMany(state, images) {
      console.log('evictMany.length = ', images.length)
      console.log('before evictMany length = ', state.cachedImages.length)
      state.cachedImages = state.cachedImages.filter(img => !images.includes(img))
      console.log('after evictMany length = ', state.cachedImages.length)
    }
  },
  actions: {
    async fetchImageUrl(context, { imageId, size }) {
      // check cache
      const cachedImage = context.getters.getImage(imageId, size)
      if (!cachedImage) {
        // fetch image and populate cache
        const response = await backendClient.fetchImageUrl(imageId, size)
        context.commit('put', { imageId, size, url: response.data.url })
        return
      }

      const now = new Date().getTime()
      const expires = Date.parse(cachedImage.expiresAt)
      if (expires < now) {
        // evict expired image and populate with new url
        console.log(`image in cache has expired on ${new Date(expires)}. Repopulating cache`, cachedImage)
        context.commit('evictOne', { imageId: cachedImage.imageId, size: cachedImage.size })
        const response = backendClient.fetchImageUrl(imageId, size)
        context.commit('put', { imageId, size, url: response.data.url })
        return
      }

      // otherwise cached image exist and is valid, so nothing to do
      console.log('use cached image. expires: ' + new Date(expires) + ', now:' + new Date(now), imageId, size)
    },
    async purgeExpired(context) {
      const expiredImages = context.getters.getExpiredImages()
      if (!expiredImages.length) {
        return
      }

      console.log('expiredImages', expiredImages.length, expiredImages)
      context.commit('evictMany', expiredImages)
    }
  },
  getters: {
    getImage: state => (imageId, size) => {
      return state.cachedImages.find(img => img.imageId === imageId && img.size === size)
    },
    getExpiredImages: state => () => {
      const now = new Date().getTime()
      return state.cachedImages.filter(img => Date.parse(img.expiresAt) < now)
    }
  }
}
