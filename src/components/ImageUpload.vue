<template>
  <v-row>
    <v-col
      v-for="(image, index) in images"
      :key="image.id"
      class="d-flex child-flex"
      cols="4"
    >
      <v-sheet
        elevation="7"
        outlined
      >
        <v-img
          class="img"
          :src="image.src"
          contain
          @click="previewImage(image)"
        />
        <v-icon
          color="accent"
          @click="deleteImage(image)"
        >
          mdi-delete
        </v-icon>
        <v-icon
          color="accent"
          @click="useImageAsThumbnail(image)"
        >
          {{ index === 0 ? 'mdi-star' : 'mdi-star-outline' }}
        </v-icon>
        <v-icon
          v-if="index !== 0"
          color="accent"
          @click="imageUp(image)"
        >
          mdi-arrow-up
        </v-icon>
        <v-icon
          v-if="index !== images.length - 1"
          color="accent"
          @click="imageDown(image)"
        >
          mdi-arrow-down
        </v-icon>
      </v-sheet>
    </v-col>



    <ImagePreviewModal
      v-if="imagePreview"
      :image="imagePreview"
      @cancel="imagePreview = null"
    />
  </v-row>
</template>

<script>
import imageService from '../service/image-service'
import ImagePreviewModal from '../modals/ImagePreviewModal'

export default {
  components: {
    ImagePreviewModal
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      images: [],
      imagePreview: null
    }
  },
  async created () {
    if (!this.value) {
      return
    }

    this.loading = true
    this.enrichImages(this.value)
      .then(images => this.images = images)
      .finally(() => this.loading = false)
  },
  methods: {
    async onChange (files) {
      const unchanged = this.images.length === files.length && this.images.every((v, i) => v === files[i]);
      if (unchanged) {
        return
      }

      this.loading = true
      const uploadPromises = files.map(file => imageService.uploadImage(file))
      Promise.all(uploadPromises)
        .then(imageIds => {
          const input = this.value ? [ ...imageIds, ...this.value] : imageIds
          this.$emit('input', input)
          this.enrichImages(imageIds)
            .then(images => this.images.push(...images))

        })
        .finally(() => this.loading = false)
    },
    async enrichImages(imageIds) {
      return Promise.all(imageIds.map(id => this.enrichImageSrc(id)))
    },
    async enrichImageSrc(imageId) {
      return imageService.fetchImageUrl(imageId, 100)
        .then(url => { return { id: imageId, src: url}})
    },
    deleteImage(deleteImage) {
      this.images = this.images.filter(image => image !== deleteImage)
      this.$emit('input', this.images.map(image => image.id));
    },
    previewImage(image) {
      this.imagePreview = image
    },
    useImageAsThumbnail(image) {
      this.images = [image, ...this.images.filter(i => i !== image)]
    },
    imageUp(image) {
      const from = this.images.indexOf(image)
      this.moveImage(image, from, from - 1)
    },
    imageDown(image) {
      const from = this.images.indexOf(image)
      this.moveImage(image, from, from + 1)
    },
    moveImage(image, from, to) {
      this.images.splice(from, 1);
      this.images.splice(to, 0, image);
    }
  }
}
</script>

<style scoped>
.img {
  margin: 10px;
}
</style>


