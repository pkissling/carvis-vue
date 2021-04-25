import { fetchImageUrl } from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    cachedImages: [],
  },
  mutations: {
    put(state, payload) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 1) // + 1 day
      state.cachedImages.push({ ...payload, expiresAt })
    },
    async evict(state, payload) {
      state.cachedImages = state.cachedImages.filter(img => img !== payload)
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
      if (now > cachedImage.expiresAt) {
        // evict expired image and populate with new url
        context.commit('evict', cachedImage)
          .then(() => fetchImageUrl(imageId, size))
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
