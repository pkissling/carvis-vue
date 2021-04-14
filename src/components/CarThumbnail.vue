<template>
  <v-avatar
    class="ma-1"
    color="secondary"
  >
    <PreviewImage
      v-if="imageId"
      :src="carThumbnails.find(thumbnail => thumbnail.id === imageId)"
      height="48"
      width="48"
      not-clickable
    />
    <v-icon v-else
            color="primary"
    >
      mdi-car-side
    </v-icon>
  </v-avatar>
</template>

<script>
import PreviewImage from './PreviewImage'

export default {
  components: {
    PreviewImage
  },
  props: {
   carThumbnails: {
      type: Array,
      default: () => []
    },
    imageId: {
      type: String,
      default: null
    }
  }
}
</script>