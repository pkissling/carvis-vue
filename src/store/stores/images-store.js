import backendClient from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    images: [],
  },
  mutations: {
    put(state, image) {
       // remove otherwise duplicated images in cache
       const duplicatedImages = state.images.filter(img => img.imageId === image.imageId && img.size === image.size)
       while (duplicatedImages.length) {
         state.images.splice(duplicatedImages.pop(), 1)
       }

       // populate new entry
       state.images.push(image)
    },
    evictOne(state, { imageId, size }) {
      state.images = state.images.filter(img => img.imageId !== imageId && img.size !== size)
    },
    evictMany(state, images) {
      state.images = state.images.filter(img => !images.includes(img))
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
        context.commit('evictOne', { imageId: cachedImage.imageId, size: cachedImage.size })
        const response = backendClient.fetchImageUrl(imageId, size)
        context.commit('put', { imageId, size, url: response.data.url })
        return
      }
    },
    async purgeExpired(context) {
      const expiredImages = context.getters.getExpiredImages()
      if (!expiredImages.length) {
        return
      }

      context.commit('evictMany', expiredImages)
    }
  },
  getters: {
    getImage: state => (imageId, size) => {
      return state.images.find(img => img.imageId === imageId && img.size === size)
    },
    getExpiredImages: state => () => {
      const now = new Date().getTime()
      return state.images.filter(img => Date.parse(img.expiresAt) < now)
    }
  }
}
