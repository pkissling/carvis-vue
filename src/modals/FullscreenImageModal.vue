<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="80vh"
      max-height="80vh"
      @input="$emit('cancel')"
    >
      <v-img
        max-width="80vh"
        max-height="80vh"
        contain
        :src="src"
        :lazy-src="lazySrc"
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </v-row>
        </template>
      </v-img>
    </v-dialog>
  </v-row>
</template>

<script>
import imageService from '../service/image-service'

export default {
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dialog: true,
      src: null
    }
  },
  computed: {
    lazySrc () {
      return this.image.src ? this.image.src : this.image.lazySrc
    }
  },
  async created () {
    if (!this.image || !this.image.id) {
      return
    }
    imageService.fetchImageUrl(this.image.id)
      .then(url => this.src = url)
  }
}
</script>
