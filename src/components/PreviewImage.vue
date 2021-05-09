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
      <ImagePagination
        :current-image="currentImage"
        :images-count="imagesCount"
      />
      <template #placeholder>
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
import ImagePagination from './ImagePagination'
import { reloadImage } from '../service/image-service'
import { captureError, captureInfo } from '../service/sentry-service'

export default {
  components: {
    FullscreenImageModal,
    ImagePagination
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
    },
    imagesCount: {
      type: Number,
      default: 0
    },
    currentImage: {
      type: Number,
      default: 0
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
    },
    _imageId() {
      return this.image && this.image.id ? this.image.id : this.imageId
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
      // prevent endless loop
      if (this.error) {
        captureError('Won\'t retry. Error is set already.', { url })
        return
      }

      // if there are no image properties, we can not fetch again
      if (!this._imageId || !this.height) {
        captureError('Can\'t retry. Properties are missing.', {
          imageId: this._imageId,
          height: this.height,
          url
        })
        this.error = true
        return
      }

      // try to fetch new image
      reloadImage(this._imageId, this.height)
          .then(url => this.reloadedSrc = url)
          .then(() => this.testReloadedSrc())
    },
    async testReloadedSrc() {
      fetch(this.reloadedSrc)
        .then(response => {
          if (!response.ok) {
            this.imageReloadFailed()
          } else {
            captureInfo('Successfully reloaded expired image.', {
              src: this.src,
              reloadedSrc: this.reloadedSrc
            })
          }
        })
        .catch(() => this.imageReloadFailed())
    },
    imageReloadFailed() {
      captureError('reloaded image can neither be resolved.', {
        src: this.src,
        reloadedSrc: this.reloadedSrc,
        imageId: this._imageId,
        height: this.height
      })
      this.error = true
      this.reloadedSrc = null
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer
}
</style>