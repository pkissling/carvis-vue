<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      @input="$emit('cancel')"
    >
      <!-- TODO Handle image loading error -->
      <v-img
        contain
        :src="src"
        :lazy-src="lazySrc"
        @click="$emit('cancel')"
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
import { fetchImageUrl } from '../service/image-service'

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
    fetchImageUrl(this.image.id, 1080)
      .then(url => this.src = url)
  }
}
</script>
