<template>
  <div>
    <v-img
      :height="height"
      :max-height="maxHeight"
      :width="width"
      :max-width="maxWidth"
      :src="_src"
      :lazy-src="_lazySrc"
      :contain="contain"
      :class="{ clickable: _clickable }"
      @click="onClick"
      @error="onError"
    >
      <ImagePagination
        :current-image-position="currentImagePosition"
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
  </div>
</template>

<script>
import ImagePagination from '@/components/ImagePagination.vue'
import { sentryStore } from '@/store'
import ImagesApi from '@/api/images-api'

const imagesApi = new ImagesApi()

export default {
  name: 'PreviewImage',
  components: {
    ImagePagination
  },
  props: {
    height: {
      type: String,
      required: true
    },
    imageId: {
      type: String,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    src: {
      type: [String, Object],
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
    maxWidth: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: null
    },
    lazySrc: {
      type: String,
      default: null
    },
    contain: {
      type: Boolean,
      default: false
    },
    imagesCount: {
      type: Number,
      default: 0
    },
    currentImagePosition: {
      type: Number,
      default: 0
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      internalError: false,
      reloadedSrc: false
    }
  },
  computed: {
    _src() {
      if (this.reloadedSrc) {
        return this.reloadedSrc
      }

      if (this._error) {
        return require('@/assets/images/car_dummy_highres.jpg')
      }

      return this.src
    },
    _lazySrc() {
      if (this._error) {
        return require('@/assets/images/car_dummy_lowres.jpg')
      }

      return this.lazySrc
    },
    _clickable() {
      if (this._error) {
        return false
      }

      return !this.notClickable
    },
    _progress() {
      return this.progress === 0 ? '0' : this.progress
    },
    _error() {
      return this.error || this.internalError
    }
  },
  methods: {
    onClick() {
      if (this._error) {
        return
      }

      this.$emit('click')
    },
    async onError(image) {
      // prevent endless loop
      if (this.internalError) {
        sentryStore.captureError({
          payload: "Won't retry. Error is set already.",
          extras: { image }
        })
        return
      }

      // if there are no image properties, we can not fetch again
      if (!this.imageId || !this.height) {
        sentryStore.captureError({
          payload: "Can't retry. Properties are missing.",
          extras: { image }
        })
        this.internalError = true
        return
      }

      // try to fetch new image
      sentryStore.captureError({
        payload: 'Image could not be loaded. Getting new imageUrl',
        extras: { image }
      })
      imagesApi.fetchImage(this.imageId, this.height)
        .then(url => (this.reloadedSrc = url))
        .catch(() => {
          this.internalError = true
          this.reloadedSrc = null
        })
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
