import axios from 'axios'
import { apiUrl } from '../../app.config'
import { obtainJwtToken } from '../auth/utils'

const instance = axios.create({
  baseURL: apiUrl(),
  timeout: 10000
})

instance.interceptors.request.use(async config => {
  const token = await obtainJwtToken()
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createUploadUrl = async (contentType) => {
  return instance.post('images', null, {
    headers: {
      'Content-Type': contentType
    }
  })
}

export const fetchImageUrl = async (imageId, size) => {
  return instance.get(`images/${imageId}`, { params: { size } })
    .then(resp => resp.data.url)
}