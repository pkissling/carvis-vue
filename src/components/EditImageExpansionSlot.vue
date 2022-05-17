<template>
  <div>
    <v-divider />
    <v-list>
      <v-list-item v-if="index !== 0"
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
      <v-list-item v-if="index > 1"
                   @click="imageUp(image)"
      >
        <v-list-item-icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Nach vorne</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="index !== 0 && index !== imageCount - 1"
        @click="imageDown(image)"
      >
        <v-list-item-icon>
          <v-icon>mdi-arrow-right</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Nach hinten</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'

@Component
export default class EditImageExpansionSlot extends Vue {
  @Prop({ required: true })
  index!: number

  @Prop({required: true })
  image!: UploadImage

  @Prop({required: true })
  images!: UploadImage[]

  @Prop({ required: true })
  imageCount!: number

  deleteImage(deleteImage: UploadImage): void {
    const images = this.images.filter(image => image !== deleteImage)
    this.$emit('input', images)
  }

  useImageAsThumbnail(image: UploadImage): void {
    const images = [image, ...this.images.filter(i => i !== image)]
    this.$emit('input', images)
  }

  imageUp(image: UploadImage): void {
    const from = this.images.indexOf(image)
    this.moveImage(image, from, from - 1)
  }

  imageDown(image: UploadImage): void {
    const from = this.images.indexOf(image)
    this.moveImage(image, from, from + 1)
  }

  moveImage(image: UploadImage, from: number, to: number): void {
    var images = this.images
    images.splice(from, 1)
    images.splice(to, 0, image)
    this.$emit('input', images)
  }
}
</script>
