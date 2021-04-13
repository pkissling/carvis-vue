<template>
  <v-card
    v-if="value && value.length > 0"
    :loading="loading"
    class="my-12"
  >
    <v-card-title class="text-h4">
      Fahrzeugbilder
    </v-card-title>
    <v-col>
      <v-skeleton-loader
        v-if="loading"
        type="image"
      />
      <v-carousel
        v-else
        cycle
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="image in images"
          :key="image.id"
        >
          <v-img
            class="clickable"
            :src="image.src"
            @click.stop="imagePreview=image"
          />
        </v-carousel-item>
      </v-carousel>

      <FullscreenImageModal
        v-if="imagePreview"
        :image="imagePreview"
        @cancel="imagePreview = null"
      />
    </v-col>
  </v-card>
</template>
<script>
import imageService from '../service/image-service'
import FullscreenImageModal from '../modals/FullscreenImageModal.vue'

export default {
  components: {
    FullscreenImageModal
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
      loading: false, // TODO
      imagePreview: null
    }
  },
  watch: {
    async value(newVal) {
      if (!newVal) {
        return
      }
      Promise.all(newVal.map(id => imageService.fetchImageUrl(id)))
        .then(images => this.images = images)
    }
  },
  async created () {
    if (!this.value) {
      this.images = []
      return
    }

    this.loading = true
    Promise.all(this.value.map(imageId => this.resolveImageUrl(imageId)))
      .finally(() => this.loading = false)
  },
  methods: {
    async resolveImageUrl (imageId) {
      return imageService.fetchImageUrl(imageId)
        .then(url => { return { id: imageId, src: url }})
        .then(image => this.images = [ ...this.images.filter(img => img.id !== imageId), image ])
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer
}
</style>