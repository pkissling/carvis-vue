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

    <v-avatar v-else
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
import PreviewImage from '@/components/PreviewImage.vue'
import { imagesStore } from '@/store'

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
  async created() {
    if (!this.imageId) {
      return
    }

    imagesStore
      .fetchImage({ imageId: this.imageId, height: '100' })
      .then(image => (this.src = image.url))
      .catch(() => (this.error = true))
  }
}
</script>
