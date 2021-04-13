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
      imageUploadQueue: [],
      loading: false,
      clearable: false
    }
  },
  computed: {
    placeholder () {
      return this.images ? 'Fahrzeugbilder hinzufügen...' : 'Weitere Fahrzeugbilder hinzufügen...'
    }
  },
  methods: {
    async onImageUpload(images) {
      images.filter(image => !image.processed)
        .map(image => this.processUploadedImage(image))
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
        };
        reader.readAsDataURL(file)
      })
    },
    async processUploadedImage(file) {
      const imageId = file.name + file.lastModified
      this.createPreview(imageId, file)
        .then(previewImage => {
          this.images = [...this.images.filter(image => image !== file), previewImage]
          this.uploadImage(previewImage.id, file)
        })
    },
    async uploadImage(previewImageId, file) {
      imageService.uploadImage(file)
        .then(uploadedImageId => imageService.fetchImageUrl(uploadedImageId, 200)
          .then(imageUrl => this.images = [ ...this.images.filter(i => i.id !== previewImageId), { id: uploadedImageId, src: imageUrl, processed: true } ])
        )
    }
  }
}
</script>