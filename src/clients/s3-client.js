import axios from 'axios'

const instance = axios.create({
  timeout: 60000
})

export const uploadFile = async (url, contentType, file) => {
  return instance.put(url, file, {
    headers: {
      'Content-Type': contentType
    }
  })
}