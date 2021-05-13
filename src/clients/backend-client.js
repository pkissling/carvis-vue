import axios from 'axios'
import { apiUrl } from '../../app.config'
import { obtainJwtToken } from '../auth/utils'
import axiosRetry from 'axios-retry'

const instance = axios.create({
  baseURL: apiUrl(),
  timeout: 10000
})

axiosRetry(instance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay
})

instance.interceptors.request.use(async config => {
  const token = await obtainJwtToken()
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
  }
}
