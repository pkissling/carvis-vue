<template>
  <div class="ma-1">
    <PreviewImage
      v-if="imageId"
      :src="src"
      :image-id="imageId"
      :error="error"
      height="48"
      width="48"
      not-clickable
    />

    <v-avatar
      v-else
      color="secondary"
      tile
    >
      <v-icon color="primary">
        mdi-car-side
      </v-icon>
    </v-avatar>
  </div>
</template>

<script>
import PreviewImage from './PreviewImage.vue'
import imageService from '../service/image-service'

export default {
  components: {
    PreviewImage
  },
  props: {
    imageId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      src: null,
      error: false
    }
  },
  created() {
    if (!this.imageId) {
     return
    }

    imageService.fetchImageUrl(this.imageId, 100)
      .then(imageDto => this.src = imageDto.url)
      .catch(() => this.error = true)
  }
}
</script>