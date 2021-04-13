<template>
  <div>
    <v-slide-group
      v-model="selectedImageIndex"
      class="pa-4"
      show-arrows
      center-active
    >
      <v-slide-item
        v-for="(image, index) in value"
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
              :lazy-src="image.lazySrc"
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
            <EditImageExpansionSlot
              v-show="editImage"
              :index="index"
              :image="image"
              :images="value"
              :image-count="value.length"
              @input="onEditImage"
            />
          </v-expand-transition>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <FullscreenImageModal
      v-if="imagePreview"
      :image="imagePreview"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import FullscreenImageModal from '../modals/FullscreenImageModal'
import EditImageExpansionSlot from './EditImageExpansionSlot'

export default {
  components: {
    FullscreenImageModal,
    EditImageExpansionSlot
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
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
        this.imagePreview = this.value[index]
      }
    },
  },
  methods: {
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
    },
    onEditImage(images) {
      this.$emit('input', images)
    }
  }
}
</script>
