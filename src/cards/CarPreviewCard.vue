<template>
  <v-card
    :loading="loading"
    class="my-12"
  >
    <div class="p-12 d-flex justify-space-between">
      <v-card-title class="text-h4">
        Fahrzeugbilder
      </v-card-title>
      <v-btn
        v-if="canEdit"
        large
        class="my-auto mx-4"
        @click="editMode = !editMode"
      >
        <v-icon>
          {{ editMode ? 'mdi-image' : 'mdi-image-edit' }}
        </v-icon>
      </v-btn>
    </div>
    <v-card-text>
      <EditCarImages
        v-if="editMode"
        :image-ids="value"
        @change="onImagesChange"
        @loading="onLoading"
      />
      <ViewCarImages
        v-else
        :image-ids="value"
        :loading="loading"
        @loading="onLoading"
      />
    </v-card-text>
  </v-card>
</template>
<script>
import ViewCarImages from '../components/ViewCarImages'
import EditCarImages from '../components/EditCarImages'

export default {
  components: {
    ViewCarImages,
    EditCarImages
  },
  props: {
    startInEditMode: {
      type: Boolean,
      value: false
    },
    value: {
      type: Array,
      default: () => [],
      immediate: true,
      handler (val) {
        if (!val) {
          this.imageIds = []
          return
        }
        this.imageIds = val
      }
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      imageIds: [],
      loading: false,
      imagePreview: null,
      editMode: this.startInEditMode
    }
  },
  computed: {
    hasMultipleImages() {
      return this.images && this.images.length > 1
    }
  },
  watch: {
    async value(newImageIds) {
      if (!newImageIds) {
        this.images = []
        return
      }

      const loadedImageIds = this.images.map(image => image.id)
      const removedImages = loadedImageIds.filter(loaded => !newImageIds.includes(loaded))
      const addedImages = newImageIds.filter(loaded => !loadedImageIds.includes(loaded))

      if (removedImages.length) {
        this.images = this.images.filter(image => !removedImages.includes(image.id))
      }

      if (addedImages.length) {
        await Promise.all(addedImages.map(imageId => this.resolveImage(imageId)))
          .then(resolvedImages => resolvedImages.map(image => this.images = [ ...this.images.filter(img => img.id !== image.id), image]))
      }

      // ensure sorting of images
      this.images = newImageIds.map((imageId, index) => {
        return { ...this.images.find(image => image.id === imageId), index }
      }).sort((a,b) => a.index - b.index)
    }
  },
  async created () {
    if (!this.value || !this.value.length) {
      return
    }
  },
  methods: {
    onImagesChange(event) {
      this.$emit('input', event)
    },
    onLoading(value) {
      this.loading = value
    }
  },
}
</script>
