import axios from 'axios'

let uploading = false
const instance = axios.create({
  timeout: 60000
})

instance.interceptors.response.use(res => {
  uploading = false
  return res
})

instance.interceptors.request.use(async req => {
  while (uploading) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  uploading = true
  return req
})

export const uploadFile = async (url, contentType, file, progressCallback) => {
  return instance.put(url, file, {
    headers: {
      'Content-Type': contentType
    },
    onUploadProgress: progressEvent => {
      const uploadPercent = Math.round(progressEvent.loaded / progressEvent.total * 100)
      progressCallback(uploadPercent)
    }
  })
}
