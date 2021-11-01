export default {
  namespaced: true,
  state: {
    loading: false
  },
  mutations: {
    setLoading(state, loading) {
      debugger
      state.loading = loading
    }
  },
  getters: {
    isLoading: state => state.loading
  }
}

