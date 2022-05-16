<template>
  <div>
    <v-skeleton-loader v-if="loading"
                       type="image"
    />
    <div v-else>
      <PreviewImage
        v-if="!images.length"
        :src="require('@/assets/images/car_dummy_highres.jpg')"
        :lazy-src="require('@/assets/images/car_dummy_lowres.jpg')"
        height="500"
        not-clickable
      />
      <v-carousel
        v-else
        v-model="activeImageIndex"
        :show-arrows="hasMultipleImages"
        :cycle="!fullscreen"
        height="500"
        hide-delimiters
      >
        <v-carousel-item v-for="image in images"
                         :key="image.id"
        >
          <PreviewImage
            height="500"
            :image-id="image.id"
            :src="image.src"
            :current-image-position="activeImageIndex + 1"
            :images-count="images.length"
            :error="image.error"
            @click="fullscreen = !fullscreen"
          />
        </v-carousel-item>
      </v-carousel>
    </div>

    <FsLightbox
      :toggler="fullscreen"
      :sources="imageUrls"
      :source-index="activeImageIndex"
    />
  </div>
</template>

<script lang="ts">
import PreviewImage from '@/components/PreviewImage.vue'
import { imagesStore } from '@/store'
import FsLightbox from "fslightbox-vue"
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'

@Component({ components: { PreviewImage, FsLightbox } })
export default class ViewCarImages extends Vue {
  @Prop({ required: true })
  loading!: boolean

  @Prop({ required: true })
  imageIds!: string[]

  images: { id: string, src?: string, error?: boolean, index?: number }[] = []
  fullscreen = false
  activeImageIndex = 0

  get hasMultipleImages(): boolean {
    return this.images?.length > 1
  }

  get imageUrls(): string[] {
    return this.images
      .map(image => image.src)
      .filter(imgSrc => imgSrc !== undefined) as string[]
  }

  @Watch('imageIds')
  async imageIdsChanged(newImageIds: string[]): Promise<void> {
    if (!newImageIds) {
      this.images = []
      return
    }

    const loadedImageIds = this.images ? this.images.map(image => image.id): []
    const removedImages = loadedImageIds.filter(loaded => !newImageIds.includes(loaded))
    const addedImages = newImageIds.filter(loaded => !loadedImageIds.includes(loaded))

    if (removedImages.length) {
      this.images = this.images.filter(image => !removedImages.includes(image.id))
    }

    if (addedImages.length) {
      const resolvedImages = await Promise.allSettled(addedImages.map(imageId => this.resolveImage(imageId)))
      resolvedImages
        .filter(res => res.status === 'fulfilled')
        .map(res => res as PromiseFulfilledResult<ImageDto>)
        .map(res => res.value)
        .forEach(image => (this.images = [...this.images.filter(img => img.id !== image.id),image]))
    }

    // ensure sorting of images
    this.images = newImageIds
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((imageId, index) => { return { ...this.images.find(image => image.id === imageId)!, index }})
      .sort((a, b) => a.index - b.index)
  }

  async created(): Promise<void> {
    if (!this.imageIds?.length) {
      return
    }

    this.$emit('loading', true)

    // const images = await Promise.allSettled(this.imageIds.map(imageId => imagesStore.fetchImage({ imageId, height: 'ORIGINAL'}))) // TODO
    // this.imageUrls = images
    //   .filter(res => res.status === 'fulfilled')
    //   .map(res => res as PromiseFulfilledResult<ImageDto>)
    //   .map(res => res.value)
    //   .map(image => image.url)

    // populate placeholders
    this.images = this.imageIds.map(imageId => {
      return { id: imageId }
    })
    // resolve image urls sequentially
    this.images.reduce(async (previousPromise, image) => {
      await previousPromise
      return this.resolveImage(image.id)
        .then(image => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const index = this.images.indexOf(this.images.find(img => img.id === image.id)!)
          this.images.splice(index, 1, image)
        })
        .finally(() => this.$emit('loading', false)) // stop loading animation after first image url was resolved
    }, Promise.resolve())
  }

  async resolveImage(imageId: string): Promise<{ id: string, src?: string, error?: boolean}> {
    return imagesStore.fetchImage({ imageId, height: '1080' })
      .then(image => { return { id: imageId, src: image.url }})
      .catch(() => { return { id: imageId, error: true }})
  }
}
</script>
