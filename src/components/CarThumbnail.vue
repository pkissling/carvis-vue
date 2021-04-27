<template>
  <v-avatar
    class="ma-1"
    color="secondary"
    rounded
  >
    <PreviewImage
      v-if="imageId"
      :src="src"
      height="48"
      width="48"
      not-clickable
    />
    <v-icon 
      v-else
      color="primary"
    >
      mdi-car-side
    </v-icon>
  </v-avatar>
</template>

<script>
import PreviewImage from './PreviewImage'
import { fetchImageUrl } from '../service/image-service'

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
      src: null
    }
  },
  created() {
    if (!this.imageId) {
     return
    }

    fetchImageUrl(this.imageId, 100)
      .then(url => this.src = url)
  }
}
</script>