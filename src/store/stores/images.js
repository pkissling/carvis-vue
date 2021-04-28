import { fetchImageUrl } from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    cachedImages: [],
  },
  mutations: {
    put(state, image) {
      console.log('put', image.imageId, image.size)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 5) // + 5 day
      state.cachedImages.push({ ...image, expiresAt })
    },
    evict(state, { imageId, size }) {
      console.log('evict', imageId, size)
      var index = state.cachedImages.findIndex(img => img.imageId === imageId && img.size === size)
      if (index === -1) {
        return
      }
      state.cachedImages.splice(index, 1)
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

      const now = new Date().getTime()
      const expires = Date.parse(cachedImage.expiresAt)
      if (expires < now) {
        // evict expired image and populate with new url
        context.commit('evict', cachedImage)
        return fetchImageUrl(imageId, size)
          .then(response => context.commit('put', { imageId, size, url: response.data.url }))
      }

      // otherwise cached image exist and is valid, so nothing to do
      console.log('use cached image. expires: ' + expires + ', now:' + now, imageId, size)
      return
    }
  },
  getters: {
    getImage: state => (imageId, size) => {
      return state.cachedImages.find(img => img.imageId === imageId && img.size === size)
    }
  }
}
