<template>
  <v-card
    :loading="loading"
    class="my-12"
  >
    <v-card-title class="text-h4">
      Fahrzeugbilder
    </v-card-title>
    <v-card-text>
      <EditImages
        v-model="images"
      />
      <v-row>
        <v-col>
          <v-file-input
            v-bind:clearable="false"
            :value="images"
            accept="image/*"
            multiple
            outlined
            label="Fahrzeugbilder"
            truncate-length="10"
            @change="onImageUpload"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import EditImages from '../components/EditImages'
import { fetchImageUrl, uploadImage } from '../service/image-service'

export default {
  components: {
    EditImages
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      images: [],
      loading: false,
      clearable: false
    }
  },
  watch: {
    images(newVal) {
      // only emit imageIds which were uploaded
      const imageIds = newVal
        .filter(image => image.id)
        .filter(image => !image.uploading)
        .map(image => image.id)

      // only emit imageIds if value has changed
      if (JSON.stringify(imageIds) !== JSON.stringify(this.value)) {
        this.$emit('input', imageIds)
      }
    }
  },
  created() {
    if (!this.value) {
      this.images = []
      return
    }

    this.value.map((imageId, index) => this.loadExistingImage(imageId, index))
  },
  methods: {
    async onImageUpload(images) {
      const imageUploadPromises = images
        .filter(image => !image.processed)
        .map((image, index) => this.processUploadedImage(image, index + this.images.length))

      if (!imageUploadPromises) {
        return
      }

      this.loading = true
      Promise.all(imageUploadPromises)
        .finally(() => this.loading = false)
    },
    createPreview(imageId, file, index) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            id: imageId,
            lazySrc: reader.result,
            progress: 0,
            processed: true,
            uploading: true,
            index
          })
        }
        reader.readAsDataURL(file)
      })
    },
    async processUploadedImage(file, index) {
      const imageId = file.name + file.lastModified
      return this.createPreview(imageId, file, index)
        .then(previewImage => {
          this.images.splice(previewImage.index, 0, previewImage)
          return previewImage
        })
        .then(previewImage => this.uploadImage(previewImage, file, previewImage.index))

    },
    async uploadImage(previewImage, file, index) {
      const progressCallback = (progress) => previewImage.progress = progress
      const uploadedImageId = await uploadImage(file, progressCallback)
      const imageUrl = await fetchImageUrl(uploadedImageId, 200)
      const lazySrc = previewImage ? previewImage.lazySrc : null
      this.images = this.images.filter(img => img.id !== previewImage.id)
      this.images.splice(index, 0, { id: uploadedImageId, src: imageUrl, lazySrc, processed: true })
    },
    async loadExistingImage(imageId, index) {
      this.images.push({ id: imageId, index, processed: true })
      fetchImageUrl(imageId, 200)
        .then(imageUrl => {
          this.images = this.images.filter(image => image.id !== imageId)
          this.images.splice(index, 0, { id: imageId, src: imageUrl, index: index, processed: true })
        })
    }
  }
}
</script>