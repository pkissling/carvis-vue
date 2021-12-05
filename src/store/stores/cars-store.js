import backendClient from '../../clients/backend-client'

export default {
  namespaced: true,
  state: {
    cars: [],
  },
  mutations: {
    putAll(state, cars) {
      state.cars = cars
    },

    put(state, car) {
      state.cars = [...state.cars.filter(c => c.id !== car.id), car]
    },

    remove(state, id) {
      state.cars = state.cars.filter(car => car.id !== id)
    }
  },
  actions: {
    async fetchAllCars(context) {
      const response = await backendClient.fetchAllCars()
      context.commit('putAll', response.data)
    },

    async fetchCar(context, id) {
      const response = await backendClient.fetchCar(id)
      context.commit('put', response.data)
    },

    async createCar(context, car) {
      const response = await backendClient.createCar(car)
      context.commit('put', response.data)
      await context.dispatch('fetchAllCars')
    },

    async updateCar(context, car) {
      const response = await backendClient.updateCar(car.id, car)
      context.commit('put', response.data)
      await context.dispatch('fetchAllCars')
    },

    async deleteCar(context, id) {
      await backendClient.deleteCar(id)
      context.commit('remove', id)
      await context.dispatch('fetchAllCars')
    }
  },

  getters: {
    allCars: state => state.cars,
    oneCar: state => id => state.cars.find(car => car.id === id)
  }
}

