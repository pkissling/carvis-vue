<template>
  <v-card
    :loading="loading"
    class="my-12"
  >
    <v-card-title class="text-h4">
      Fahrzeugbilder
    </v-card-title>
    <v-card-text>
      <UploadedImagesPreview
        v-model="images"
      />
      <v-row>
        <v-col>
          <v-file-input
            :value="images"
            accept="image/*"
            multiple
            outlined
            :clearable="clearable"
            label="Fahrzeugbilder"
            :placeholder="placeholder"
            truncate-length="10"
            @change="onImageUpload"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import UploadedImagesPreview from './UploadedImagesPreview'
import imageService from '../service/image-service'

export default {
  components: {
    UploadedImagesPreview
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
  computed: {
    placeholder () {
      return this.images ? 'Fahrzeugbilder hinzufügen...' : 'Weitere Fahrzeugbilder hinzufügen...'
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
        .map(image => this.processUploadedImage(image))

      if (!imageUploadPromises) {
        return
      }

      this.loading = true
      Promise.all(imageUploadPromises)
        .finally(() => this.loading = false)
    },
    createPreview(imageId, file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            id: imageId,
            lazySrc: reader.result,
            processed: true
          })
        }
        reader.readAsDataURL(file)
      })
    },
    async processUploadedImage(file) {
      const imageId = file.name + file.lastModified
      return this.createPreview(imageId, file)
        .then(previewImage => {
          this.images = [...this.images.filter(image => image !== file), previewImage]
          return previewImage
        })
        .then(previewImage => this.uploadImage(previewImage.id, file))

    },
    async uploadImage(previewImageId, file) {
      const uploadedImageId = await imageService.uploadImage(file)
      const imageUrl = await imageService.fetchImageUrl(uploadedImageId, 200)
      this.images = [ ...this.images.filter(i => i.id !== previewImageId), { id: uploadedImageId, src: imageUrl, processed: true } ]
    },
    async loadExistingImage(imageId, index) {
      this.images.push({ id: imageId, index, processed: true })
      imageService.fetchImageUrl(imageId)
        .then(imageUrl => {
          this.images = [ ...this.images.filter(image => image.id !== imageId), { id: imageId, src: imageUrl, index: index, processed: true }]
            .sort((a,b) => a.index < b.index)
        })

    }
  }
}
</script>