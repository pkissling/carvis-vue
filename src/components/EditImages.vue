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
        <CarvisCard
          class="ma-4"
          elevation="5"
          width="200"
          outlined
        >
          <v-card-title>
            {{ index === 0 ? 'Titelbild' : 'Galleriebild ' + index }}
          </v-card-title>
          <v-divider />
          <PreviewImage
            width="200"
            height="200"
            :src="image.src"
            :lazy-src="image.lazySrc"
            :image-id="image.id"
            :progress="image.progress"
            :error="image.error"
            not-clickable
          />
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
              <v-icon>
                {{
                  editImage ? 'mdi-chevron-up' : 'mdi-chevron-down'
                }}
              </v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <EditImageExpansionSlot
              v-show="editImage"
              :index="index"
              :image="image"
              :images="value"
              :image-count="value.length"
              @input="onEditImages"
            />
          </v-expand-transition>
        </CarvisCard>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'
import EditImageExpansionSlot from './EditImageExpansionSlot.vue'
import PreviewImage from './PreviewImage.vue'

@Component({ components: { PreviewImage, EditImageExpansionSlot }})
export default class EditImages extends Vue {
  @Prop({ required: true})
  value!: UploadImage[]

  editImage = false

  onEditImages(images: UploadImage[]): void {
    this.$emit('input', images)
  }
}
</script>
