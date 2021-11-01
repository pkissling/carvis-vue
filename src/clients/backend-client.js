import axios from 'axios'
import { apiUrl } from '../../app.config'
import { obtainJwtToken } from '../auth/utils'
import axiosRetry from 'axios-retry'
import store from '../store'

const instance = axios.create({
  baseURL: apiUrl(),
  timeout: 10000
})

axiosRetry(instance, {
  retryDelay: axiosRetry.exponentialDelay
})

instance.interceptors.request.use(async request => {
  const token = await obtainJwtToken()
  request.headers.Authorization = `Bearer ${token}`
  store.commit('common/setLoading', true)
  return request
})

instance.interceptors.response.use(response => {
  store.commit('common/setLoading', false)
  return response
})

export default {
  async createUploadUrl (contentType) {
    return instance.post('images', null, {
      headers: {
        'Content-Type': contentType
      }
    })
  },

  async fetchImageUrl (imageId, size) {
    return instance.get(`images/${imageId}`, { params: { size } })
  },

  async fetchAllCars() {
    return instance.get('/cars')
  },

  async fetchCar(id) {
    return instance.get(`/cars/${id}`)
  },

  async createCar(car) {
    return instance.post('/cars', car)
  },

  async updateCar(id, car) {
    return instance.put(`/cars/${id}`, car)
  },

  async deleteCar(id) {
    return instance.delete(`/cars/${id}`)
  }
}
