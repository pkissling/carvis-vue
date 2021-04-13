<template>
  <div>
    <v-slide-group
      class="pa-4"
      show-arrows
      center-active
    >
      <v-slide-item
        v-for="(image, index) in value"
        :key="image.id"
      >
        <v-card
          class="ma-4"
          elevation="7"
          width="200"
          outlined
        >
          <div
            class="clickable"
            @click.prevent="fullScreenImage = image"
          >
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
      v-if="fullScreenImage"
      :image="fullScreenImage"
      @cancel="fullScreenImage = null"
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
      fullScreenImage: null,
      editImage: false,
    }
  },
  methods: {
    onEditImage(images) {
      this.$emit('input', images)
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer
}
</style>
