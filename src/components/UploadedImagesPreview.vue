<template>
  <div>
    <v-slide-group
      v-model="selectedImageIndex"
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
          class="ma-4"
          elevation="7"
          width="200"
          outlined
        >
          <div @click="toggle">
            <v-card-title>
              {{ index === 0 ? 'Titelbild' : 'Galleriebild ' + index }}
            </v-card-title>
            <v-divider />
            <v-img
              width="200"
              height="200"
              :src="image.src"
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
          </div>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="editImage = !editImage"
            >
              Bearbeiten
            </v-btn>

            <v-spacer />

            <v-btn
              icon
              @click="editImage = !editImage"
            >
              <v-icon>{{ editImage ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="editImage">
              <v-divider />

              <v-list>
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
                  v-if="index !== 0 && index !== images.length - 1"
                  @click="imageDown(image)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Nach hinten</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <ImagePreviewModal
      v-if="imagePreview"
      :image="imagePreview"
      @cancel="onCancel"
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
      images: [],
      imagePreview: null,
      editImage: false,
      selectedImageIndex: -1
    }
  },
  watch: {
    selectedImageIndex(index) {
      if (index === -1) {
        this.imagePreview = null
      } else {
        this.imagePreview = this.images[index]
      }
    },
    value(newVal) {
     this.enrichImages(newVal)
      .then(images => this.images = images)
    }
  },
  async created () {
    if (!this.value) {
      return
    }

    this.enrichImages(this.value)
      .then(images => this.images = images)
  },
  methods: {
    // async onChange (files) {
    //   const unchanged = this.images.length === files.length && this.images.every((v, i) => v === files[i]);
    //   if (unchanged) {
    //     return
    //   }

    //   const uploadPromises = files.map(file => imageService.uploadImage(file))
    //   Promise.all(uploadPromises)
    //     .then(imageIds => {
    //       const input = this.value ? [ ...imageIds, ...this.value] : imageIds
    //       this.$emit('input', input)
    //       this.enrichImages(imageIds)
    //         .then(images => this.images.push(...images))
    //     })
    // },
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
    useImageAsThumbnail(image) {
      this.images = [image, ...this.images.filter(i => i !== image)]
      this.$emit('input', this.images.map(image => image.id));
    },
    imageUp(image) {
      const from = this.images.indexOf(image)
      this.moveImage(image, from, from - 1)
    },
    imageDown(image) {
      const from = this.images.indexOf(image)
      this.moveImage(image, from, from + 1)
    },
    moveImage(image, from, to) {
      this.images.splice(from, 1);
      this.images.splice(to, 0, image)
      this.$emit('input', this.images.map(image => image.id));
    },
    toggleMenu(index) {
      if (this.editImage === -1) {
        this.editImage = index
      } else {
        this.editImage = -1
      }
    },
    onCancel() {
      this.editImage = null
      this.selectedImageIndex = -1
    }
  }
}
</script>
