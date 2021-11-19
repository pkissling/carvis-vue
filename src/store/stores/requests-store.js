import backendClient from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    requests: [],
  },
  mutations: {
    putAll(state, requests) {
      state.requests = requests
    },

    put(state, request) {
      state.requests = [...state.requests.filter(r => r.id !== request.id), request]
    },

    remove(state, id) {
      state.requests = state.requests.filter(request => request.id !== id)
    }
  },
  actions: {
    async fetchAllRequests(context) {
      const response = await backendClient.fetchAllRequests()
      context.commit('putAll', response.data)
    },

    async fetchRequest(context, id) {
      const response = await backendClient.fetchRequest(id)
      context.commit('put', response.data)
    },

    async createRequest(context, request) {
      const response = await backendClient.createRequest(request)
      context.commit('put', response.data)
    },

    async updateRequest(context, request) {
      const response = await backendClient.updateRequest(request.id, request)
      context.commit('put', response.data)
    },

    async deleteRequest(context, id) {
      await backendClient.deleteRequest(id)
      context.commit('remove', id)
    }
  },

  getters: {
    allRequests: state => state.requests,
    oneRequest: state => id => state.requests.find(request => request.id === id)
  }
}

