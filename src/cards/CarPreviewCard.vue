<template>
  <v-card class="my-12">
    <v-card-title class="text-h4">
      Fahrzeugbilder
    </v-card-title>
    <v-col>
      <!-- TODO lazy src / dummy loader? -->
      <PreviewImage
        v-if="images.length === 0"
        :src="require('@/assets/images/car_dummy.jpg')"
        :lazy-src="require('@/assets/images/car_dummy.jpg')"
        not-clickable
      />
      <div v-else>
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
            <PreviewImage
              :image="image"
            />
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-col>
  </v-card>
</template>
<script>
import imageService from '../service/image-service'
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