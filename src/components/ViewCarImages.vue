<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      type="image"
    />
    <div v-else>
      <PreviewImage
        v-if="!images.length"
        :src="require('@/assets/images/car_dummy_highres.jpg')"
        :lazy-src="require('@/assets/images/car_dummy_lowres.jpg')"
        height="500"
        not-clickable
      />
      <div v-else>
        <v-carousel
          :show-arrows="hasMultipleImages"
          :cycle="!fullscreen"
          height="500"
          hide-delimiters
        >
          <v-carousel-item
            v-for="(image, i) in images"
            :key="image.id"
          >
            <PreviewImage
              height="500"
              :image-id="image.id"
              :src="image.src"
              :current-image-position="i + 1"
              :images-count="images.length"
              :error="image.error"
              @fullscreen="onFullscreen"
            />
          </v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewImage from '@/components/PreviewImage.vue'
import { imagesStore } from '@/store'

export default {
  components: {
    PreviewImage
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    imageIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      images: [],
      fullscreen: false
    }
  },
   computed: {
    hasMultipleImages() {
      return this.images && this.images.length > 1
    }
  },
  watch: {
    async imageIds(newImageIds) {
      if (!newImageIds) {
        this.images = []
        return
      }

      const loadedImageIds = this.images ? this.images.map(image => image.id) : []
      const removedImages = loadedImageIds.filter(loaded => !newImageIds.includes(loaded))
      const addedImages = newImageIds.filter(loaded => !loadedImageIds.includes(loaded))

      if (removedImages.length) {
        this.images = this.images.filter(image => !removedImages.includes(image.id))
      }

      if (addedImages.length) {
        await Promise.allSettled(addedImages.map(imageId => this.resolveImage(imageId)))
          .then(resolvedImages => resolvedImages.map(image => this.images = [ ...this.images.filter(img => img.id !== image.id), image]))
      }

      // ensure sorting of images
      this.images = newImageIds.map((imageId, index) => {
        return { ...this.images.find(image => image.id === imageId), index }
      }).sort((a,b) => a.index - b.index)
    }
  },

  async created () {
    if (!this.imageIds || !this.imageIds.length) {
      return
    }

    this.$emit('loading', true)

    // populate placeholders
    this.images = this.imageIds.map(imageId => { return { id: imageId }})
    // resolve image urls sequentially
    this.images.reduce(async (previousPromise, image) => {
      await previousPromise
      return this.resolveImage(image.id)
        .then(image => {
          const index = this.images.indexOf(this.images.find(img => img.id === image.id))
          this.images.splice(index, 1, image)
        })
        .finally(() => this.$emit('loading', false)) // stop loading animation after first image url was resolved
    }, Promise.resolve())
  },
  methods: {
    async resolveImage (imageId) {
      return imagesStore.fetchImage({ imageId, height: '500' })
        .then(image => { return { id: imageId, src: image.url }})
        .catch(() => { return { id: imageId, error: true }})
    },
    onFullscreen(value) {
      this.fullscreen = value
    }
  }
}
</script>
