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
        console.log('no evict', imageId)
        return
      }
      console.log('before evict index: ' + index, imageId, state.cachedImages.length)
      state.cachedImages.splice(index, 1)
      console.log('after evict index: ' + index, imageId, state.cachedImages.length)
    },
    purge(state) {
      console.log('purged cache')
      state.cachedImages = []
    }
  },
  actions: {
    async fetchImageUrl(context, { imageId, size }) {
      // check cache
      const cachedImage = context.getters.getImage(imageId, size)
      if (!cachedImage) {
        // fetch image and populate cache
        const response = await fetchImageUrl(imageId, size)
        context.commit('put', { imageId, size, url: response.data.url })
        return
      }

      const now = new Date().getTime()
      const expires = Date.parse(cachedImage.expiresAt)
      if (expires < now) {
        // evict expired image and populate with new url
        context.commit('evict', cachedImage)
        const response = fetchImageUrl(imageId, size)
        context.commit('put', { imageId, size, url: response.data.url })
        return
      }

      // otherwise cached image exist and is valid, so nothing to do
      console.log('use cached image. expires: ' + expires + ', now:' + now, imageId, size)
    }
  },
  getters: {
    getImage: state => (imageId, size) => {
      return state.cachedImages.find(img => img.imageId === imageId && img.size === size)
    }
  }
}
