import backendClient from '../../clients/backend-client'
import userService from '../../service/user-service'

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
      const response = await backendClient.createCar({
        // TODO this must be done in the backend
        ownerName: userService.getName(),
        ...car
      })
      context.commit('put', response.data)
    },

    async updateCar(context, car) {
      const response = await backendClient.updateCar(car.id, car)
      context.commit('put', response.data)
    },

    async deleteCar(context, id) {
      await backendClient.deleteCar(id)
      context.commit('remove', id)
    }
  },

  getters: {
    allCars: state => state.cars,
    oneCar: state => id => state.cars.find(car => car.id === id)
  }
}

