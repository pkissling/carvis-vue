import backendClient from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    cars: [],
  },
  mutations: {
    put(state, car) {
      console.log('put', car)

      // remove otherwise duplicated car in cache
      const duplicatedCars = state.cars.filter(c => c.id === car.id)
      while (duplicatedCars.length) {
        console.log('removing otherwise duplicated car', duplicatedCars[duplicatedCars.length - 1])
        state.cars.splice(duplicatedCars.pop(), 1);
      }

      // populate new entry
      console.log('before put', state.cars.length)
      state.cars.push(car)
      console.log('after put', state.cars.length)
    }
  },
  actions: {
    async fetchCars(context) {
      const response = await backendClient.fetchCars()
      response.data.forEach(car => context.commit('put', car))
    }
  },

  getters: {
    allCars: state => state.cars
  }
}

