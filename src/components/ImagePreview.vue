<template>
  <v-col v-if="images.length > 0">
    <v-carousel
      cycle
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item
        v-for="(image, i) in images"
        :key="i"
      >
        <v-img
          contain
          :src="image"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              />
            </v-row>
          </template>
        </v-img>
      </v-carousel-item>
    </v-carousel>
  </v-col>
</template>
<script>
import imageService from '../service/image-service'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      images: [],
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2
      }
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
    }

    Promise.all(this.value.map(id => imageService.fetchImageUrl(id)))
        .then(images => this.images = images)
  }
}
</script>