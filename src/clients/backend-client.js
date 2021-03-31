import axios from 'axios'
import { apiUrl } from '../../app.config'

const instance = axios.create({
  baseURL: apiUrl(),
  timeout: 2000
})

export const createUploadUrl = async () => {
  return instance.post('images')
}