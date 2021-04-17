<template>
  <div>
    <!-- TODO on error refretch image -->
    <v-img
      :height="height"
      :width="width"
      :src="_src"
      :lazy-src="_lazySrc"
      :contain="contain"
      :class="{ 'clickable': _clickable }"
      @click="onClick"
      @error="error = true"
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

    <FullscreenImageModal
      v-if="fullscreen"
      :image="image"
      @cancel="fullscreen = false"
    />
  </div>
</template>

<script>
import FullscreenImageModal from '../modals/FullscreenImageModal'

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
    }
  },
  data() {
    return {
      fullscreen: false,
      error: false
    }
  },
  computed: {
    _src() {
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
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer
}
</style>