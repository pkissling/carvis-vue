<template>
  <div>
    <v-img
      :height="height"
      :width="width"
      :src="_src"
      :lazy-src="_lazySrc"
      :contain="contain"
      :class="{ 'clickable': !notClickable }"
      @click="onClick"
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
      type: String,
      default: ''
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
      fullscreen: false
    }
  },
  computed: {
    _src() {
      if (this.src) {
        return this.src
      }

      return this.image ? this.image.src : null
    },
    _lazySrc() {
      return this.image ? this.image.lazySrc : null
    }
  },
  methods: {
    onClick() {
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