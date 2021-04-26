import axios from 'axios'

const uploadQueue = []

const instance = axios.create({
  timeout: 60000
})

instance.interceptors.response.use(res => {
  const index = uploadQueue.indexOf(uploadQueue.find(item => item.url === res.config.url))
  uploadQueue.splice(index, 1, { url: res.config.url, uploaded: true })
  return res
})

instance.interceptors.request.use(async req => {
  while (req.url !== uploadQueue
    .filter(item => item.uploaded === false)
    .map(item => item.url)[0]) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  return req
})

export const uploadFile = async (url, contentType, file, progressCallback, index) => {
  uploadQueue.splice(index, 0, { url, uploaded: false })
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
