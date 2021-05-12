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
        max-height="90vh"
        :not-clickable="true"
        contain
        @click="$emit('cancel')"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import imageService from '../service/image-service'

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
      height: '1080'
    }
  },
  beforeCreate: function(){
    this.$options.components.PreviewImage = require("../components/PreviewImage.vue").default;
  },
  async created () {
    imageService.fetchImageUrl(this.imageId, this.height)
      .then(url => this.src = url)
  }
}
</script>
