<template>
  <div>
    <v-slide-group
      v-model="selectedImage"
      class="pa-4"
      show-arrows
      center-active
    >
      <v-slide-item
        v-for="(image, index) in images"
        :key="image.id"
        v-slot="{ active, toggle }"
      >
        <v-card
          color="grey lighten-1"
          class="ma-4"
          height="200"
          width="200"
          @click="toggle"
        >
          <v-menu
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-img
                height="200"
                max-width="200"
                :src="image.src"
                v-bind="attrs"
                class="text-right pa-2"
                v-on="on"
              >
                <v-btn
                  v-if="index === 0"
                  icon
                  color="primary"
                >
                  <v-icon>mdi-star</v-icon>
                </v-btn>
              </v-img>
            </template>

            <v-list>
              <v-list-item @click.stop="imagePreview=image">
                <v-list-item-icon>
                  <v-icon>mdi-fullscreen</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Vollbild</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="index !== 0"
                @click="useImageAsThumbnail(image)"
              >
                <v-list-item-icon>
                  <v-icon>mdi-star</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Als Titelbild</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteImage(image)">
                <v-list-item-icon>
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Löschen</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="index > 1"
                @click="imageUp(image)"
              >
                <v-list-item-icon>
                  <v-icon>mdi-arrow-left</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Nach vorne</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="index !== images.length - 1"
                @click="imageDown(image)"
              >
                <v-list-item-icon>
                  <v-icon>mdi-arrow-right</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Nach hinten</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <ImagePreviewModal
      v-if="imagePreview"
      :image="imagePreview"
      @cancel="imagePreview = null"
    />
  </div>
</template>

<script>
import imageService from '../service/image-service'
import ImagePreviewModal from '../modals/ImagePreviewModal'

export default {
  components: {
    ImagePreviewModal
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      images: [],
      imagePreview: null,
      selectedImage: null
    }
  },
  async created () {
    if (!this.value) {
      return
    }

    this.loading = true
    this.enrichImages(this.value)
      .then(images => this.images = images)
      .finally(() => this.loading = false)
  },
  methods: {
    async onChange (files) {
      const unchanged = this.images.length === files.length && this.images.every((v, i) => v === files[i]);
      if (unchanged) {
        return
      }

      this.loading = true
      const uploadPromises = files.map(file => imageService.uploadImage(file))
      Promise.all(uploadPromises)
        .then(imageIds => {
          const input = this.value ? [ ...imageIds, ...this.value] : imageIds
          this.$emit('input', input)
          this.enrichImages(imageIds)
            .then(images => this.images.push(...images))

        })
        .finally(() => this.loading = false)
    },
    async enrichImages(imageIds) {
      return Promise.all(imageIds.map(id => this.enrichImageSrc(id)))
    },
    async enrichImageSrc(imageId) {
      return imageService.fetchImageUrl(imageId, 200)
        .then(url => { return { id: imageId, src: url}})
    },
    deleteImage(deleteImage) {
      this.images = this.images.filter(image => image !== deleteImage)
      this.$emit('input', this.images.map(image => image.id));
    },
    previewImage(image) {
      this.imagePreview = image
    },
    useImageAsThumbnail(image) {
      this.images = [image, ...this.images.filter(i => i !== image)]
    },
    imageUp(image) {
      const from = this.images.indexOf(image)
      this.moveImage(image, from, from - 1)
      this.selectedImage--
    },
    imageDown(image) {
      const from = this.images.indexOf(image)
      this.moveImage(image, from, from + 1)
      this.selectedImage++
    },
    moveImage(image, from, to) {
      this.images.splice(from, 1);
      this.images.splice(to, 0, image)
    }
  }
}
</script>

<style scoped>
.img {
  margin: 10px;
}
</style>


