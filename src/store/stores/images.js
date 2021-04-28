import { fetchImageUrlBackend } from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    cachedImages: [],
  },
  mutations: {
    put(state, image) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 1) // + 1 day
      state.cachedImages.push({ ...image, expiresAt })
    },
    evict(state, { imageId, size }) {
      state.cachedImages = state.cachedImages.filter(img => img.imageId !== imageId && img.size == size)
    }
  },
  actions: {
    fetchImageUrl(context, { imageId, size }) {
      // check cache
      const cachedImage = context.getters.getImage(imageId, size)
      if (!cachedImage) {
        // fetch image and populate cache
        return fetchImageUrl(imageId, size)
          .then(response => context.commit('put', { imageId, size, url: response.data.url }))
      }

      const now = new Date()
      const expires = new Date(cachedImage.expiresAt)
      if (now.getTime() > expires.getTime()) {
        // evict expired image and populate with new url
        context.commit('evict', cachedImage)
        return fetchImageUrlBackend(imageId, size)
          .then(response => context.commit('put', { imageId, size, url: response.data.url }))
      }

      // otherwise cached image exist and is valid, so nothing to do
      return
    }
  },
  getters: {
    getImage: state => (imageId, size) => {
      return state.cachedImages.find(img => img.imageId === imageId && img.size === size)
    }
  }
}
