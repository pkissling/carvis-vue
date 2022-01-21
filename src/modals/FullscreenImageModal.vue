<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      @input="$emit('cancel')"
    >
      <PreviewImage
        :src="src"
        :lazy-src="lazySrc"
        :height="height"
        :image-id="imageId"
        :not-clickable="true"
        :error="error"
        max-height="90vh"
        contain
        @click="$emit('cancel')"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import { imagesStore } from '@/store'

export default {
  props: {
    imageId: {
      type: String,
      required: true
    },
    lazySrc: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      dialog: true,
      src: null,
      height: '1080',
      error: false
    }
  },
  beforeCreate: function(){
    this.$options.components.PreviewImage = require("../components/PreviewImage.vue").default;
  },
  async created () {
    imagesStore.fetchImage({ imageId: this.imageId, height: this.height })
      .then(image => this.src = image.url)
      .catch(() => this.error = true)
  }
}
</script>
