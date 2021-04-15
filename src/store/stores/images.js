import { fetchImageUrl } from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    cachedImages: [],
  },
  mutations: {
    put(state, payload) {
      // TODO purge old items!
      state.cachedImages.push(payload)
    }
  },
  actions: {
    fetchImageUrl(context, { imageId, size }) {
      // check cache
      const hasImage = this.state.images.cachedImages.find(img => img.imageId === imageId && img.size === size)
      if (hasImage) {
        return
      }

      // fetch image and populate cache
      return fetchImageUrl(imageId, size)
        .then(response => context.commit('put', { imageId, size, url: response.data.url }))
    }
  }
}


