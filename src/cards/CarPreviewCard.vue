<template>
  <v-card
    :loading="loading"
    class="my-12"
  >
    <v-card-title class="text-h4">
      Fahrzeugbilder
    </v-card-title>
    <v-card-text>
      <v-skeleton-loader
        v-if="loading"
        type="image"
      />
      <div v-else>
        <PreviewImage
          v-if="!images.length && !loading"
          :src="require('@/assets/images/car_dummy_highres.jpg')"
          :lazy-src="require('@/assets/images/car_dummy_lowres.jpg')"
          height="500"
          not-clickable
        />
        <div v-else>
          <v-carousel
            height="500"
            cycle
            hide-delimiter-background
          >
            <v-carousel-item
              v-for="image in images"
              :key="image.id"
            >
              <PreviewImage
                height="500"
                :image-id="image.id"
                :image="image"
              />
            </v-carousel-item>
          </v-carousel>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { fetchImageUrl } from '../service/image-service'
import PreviewImage from '../components/PreviewImage'

export default {
  components: {
    PreviewImage
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
      imagePreview: null
    }
  },
  watch: {
    async value(newImageIds) {
      if (!newImageIds) {
        this.images = []
        return
      }

      const loadedImageIds = this.images.map(image => image.id)
      const removedImages = loadedImageIds.filter(loaded => !newImageIds.includes(loaded))
      const addedImages = newImageIds.filter(loaded => !loadedImageIds.includes(loaded))

      if (removedImages.length) {
        this.images = this.images.filter(image => !removedImages.includes(image.id))
      }

      if (addedImages.length) {
        await Promise.all(addedImages.map(imageId => this.resolveImage(imageId)))
          .then(resolvedImages => resolvedImages.map(image => this.images = [ ...this.images.filter(img => img.id !== image.id), image]))
      }

      // ensure sorting of images
      this.images = newImageIds.map((imageId, index) => {
        return { ...this.images.find(image => image.id === imageId), index }
      }).sort((a,b) => a.index - b.index)
    }
  },
  async created () {
    if (!this.value || !this.value.length) {
      return
    }

    this.loading = true
    // populate placeholders
    this.images = this.value.map(imageId => { return { id: imageId }})

    // resolve image urls sequentially
    this.images.reduce(async (previousPromise, image) => {
      await previousPromise
      return this.resolveImage(image.id)
        .then(image => {
          const index = this.images.indexOf(this.images.find(img => img.id === image.id))
          this.images.splice(index, 1, image)
        })
        .then(() => this.loading = false) // stop loading animation after first image url was resolved
    }, Promise.resolve())
  },
  methods: {
    async resolveImage (imageId) {
      return fetchImageUrl(imageId, 500)
        .then(url => { return { id: imageId, src: url }})
    }
  }
}
</script>
