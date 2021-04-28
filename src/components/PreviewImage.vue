<template>
  <div>
    <v-img
      :height="height"
      :width="width"
      :src="_src"
      :lazy-src="_lazySrc"
      :contain="contain"
      :class="{ 'clickable': _clickable }"
      @click="onClick"
      @error="onError"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            v-if="progress"
            :value="progress"
            color="primary"
          >
            {{ progress }}
          </v-progress-circular>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
          />
        </v-row>
      </template>
    </v-img>

    <FullscreenImageModal
      v-if="fullscreen"
      :image="image"
      @cancel="fullscreen = false"
    />
  </div>
</template>

<script>
import FullscreenImageModal from '../modals/FullscreenImageModal'
import { reloadImage } from '../service/image-service'
import { captureMessage } from '../service/sentry-service'

export default {
  components: {
    FullscreenImageModal
  },
  props: {
    image: {
      type: Object,
      default: null
    },
    notClickable: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    },
    src: {
      type: [String, Object],
      default: null
    },
    lazySrc: {
      type: String,
      default: ''
    },
    contain: {
      type: Boolean,
      default: false
    },
    imageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fullscreen: false,
      error: false,
      reloadedSrc: false
    }
  },
  computed: {
    _src() {
      if (this.reloadedSrc) {
        return this.reloadedSrc
      }

      if (this.error) {
        // TODO: dedicated placeholder for not found?
        return require("@/assets/images/car_dummy_highres.jpg")
      }

      if (this.src) {
        return this.src
      }

      return this.image ? this.image.src : null
    },
    _lazySrc() {
      if (this.error) {
        return require("@/assets/images/car_dummy_lowres.jpg")
      }

      return this.image ? this.image.lazySrc : null
    },
    _clickable() {
      if (this.error) {
        return false
      }

      return !this.notClickable
    },
    progress() {
      if (!this.image || this.image.progress === null) {
        return null
      }

      return this.image.progress === 0 ? "0" : this.image.progress
    }
  },
  watch: {
    fullscreen(newVal) {
      this.$emit('fullscreen', newVal)
    }
  },
  methods: {
    onClick() {
      if (this.error) {
        return
      }

      if (!this.notClickable) {
        this.fullscreen = true
      }
    },
    async onError(url) {
      captureMessage(`exception caught while resolving url: ${url}`)

      // prevent endless loop
      if (this.error) {
        return
      }

      // if there are no image properties, we can not fetch again
      if (!this.imageId || !this.height) {
        this.error = true
        return
      }

      // try to fetch new image
      reloadImage(this.imageId, this.height)
          .then(url => this.reloadedSrc = url)
          .then(() => this.testReloadedSrc())
    },
    async testReloadedSrc() {
      fetch(this.src)
        .then(response => {
          if (!response.ok) {
            captureMessage(`reloaded image can not be resolved either. url=[${this.reloadedSrc}], imageId=[${this.imageId}], size=[${this.height}]`)
            this.reloadedSrc = null
            this.error = true
          }
        })
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer
}
</style>