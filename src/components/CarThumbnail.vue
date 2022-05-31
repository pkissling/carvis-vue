<template>
  <div class="ma-1">
    <PreviewImage
      v-if="imageId"
      :src="src"
      :image-id="imageId"
      :error="error"
      height="48"
      width="48"
      not-clickable
    />

    <v-avatar
      v-else
      color="secondary"
      tile
    >
      <v-icon color="primary">
        mdi-car-side
      </v-icon>
    </v-avatar>
  </div>
</template>

<script lang="ts">
import ImagesApi from '@/api/images-api'
import PreviewImage from '@/components/PreviewImage.vue'
import { Prop, Vue, Component } from 'vue-property-decorator'

const imagesApi = new ImagesApi()

@Component({ components: { PreviewImage } })
export default class CarThumbnail extends Vue {
  @Prop({ required: true })
  imageId!: string

  src: string | null = null
  error = false
 
  async created(): Promise<void> {
    if (!this.imageId) {
      return
    }

    imagesApi.fetchImage(this.imageId, '100')
      .then(image => (this.src = image.url))
      .catch(() => (this.error = true))
  }
}
</script>
