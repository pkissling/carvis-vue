<template>
  <div>
    <EditImages v-model="images" />
    <v-row>
      <v-col>
        <v-file-input
          :clearable="false"
          :value="images"
          accept="image/*"
          multiple
          outlined
          label="Fahrzeugbilder"
          truncate-length="10"
          @change="onImageUpload"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import EditImages from '@/components/EditImages.vue'
import { notificationsStore } from '@/store'
import ImagesApi from '@/api/images-api'
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import S3Api from '@/api/s3-api'

const imagesApi = new ImagesApi()
const s3Api = new S3Api()

@Component({ components: { EditImages }})
export default class EditCarImages extends Vue {
  @Prop({ required: true })
  imageIds!: string[]

  images: UploadImage[] = []

  @Watch('images')
  imagesChanged(newVal: UploadImage[]): void {
      // only emit imageIds which were uploaded
      const imageIds = newVal
        .filter(image => image.id)
        .filter(image => !image.uploading)
        .map(image => image.id)

      // only emit imageIds if value has changed
      if (JSON.stringify(imageIds) !== JSON.stringify(this.imageIds)) {
        this.$emit('change', imageIds)
      }
    }

  created(): void {
    if (!this.imageIds) {
      this.images = []
      return
    }

    this.imageIds.map((imageId, index) => this.loadExistingImage(imageId, index))
  }

  async onImageUpload(images: File[]): Promise<void> {
      const imageUploadPromises = images
        // .filter(image => !image.processed)
        .map((image, index) => this.processUploadedImage(image, index + this.images.length))

      if (!imageUploadPromises) {
        return
      }

      this.$emit('loading', true)
      Promise.allSettled(imageUploadPromises)
        .finally(() =>this.$emit('loading', false))
    }

    createPreview(imageId: string, file: File): Promise<UploadImage> {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            id: imageId,
            lazySrc: reader.result || undefined,
            progress: 0,
            processed: true,
            uploading: true
          })
        }
        reader.readAsDataURL(file)
      })
    }

    async processUploadedImage(file: File, index: number): Promise<void> {
      const imageId = file.name + file.lastModified
      return this.createPreview(imageId, file)
        .then(previewImage => {
          this.images.splice(index, 0, previewImage)
          return previewImage
        })
        .then(previewImage => this.uploadImage(previewImage, file, index))
    }

    async uploadImage(previewImage: UploadImage, file: File, index: number): Promise<void> {
      const progressCallback = (progress: number) => (previewImage.progress = progress)
      try {
        const contentType = file.type
        const uploadUrlResponse = await imagesApi.createUploadUrl(contentType)
        await s3Api.uploadFile(uploadUrlResponse.url.toString(), contentType, file, progressCallback, index)
        const image = await imagesApi.fetchImage(uploadUrlResponse.id, '200')
        const lazySrc = previewImage?.lazySrc
        this.images = this.images.filter(img => img.id !== previewImage.id)
        this.images.splice(index, 0, {
          id: uploadUrlResponse.id,
          src: image.url,
          lazySrc,
          processed: true,
          uploading: false,
          progress: 0
        })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        notificationsStore.error({ message: 'Fehler beim Hochladen eines Bildes. Bitte versuche es erneut.', err})
        this.images = this.images.filter(img => img.id !== previewImage.id)
      }
    }

    async loadExistingImage(imageId: string, index: number): Promise<void> {
      this.images.push({ id: imageId, processed: true })
      imagesApi.fetchImage(imageId, '200')
        .then(image => {
          this.images = this.images.filter(image => image.id !== imageId)
          this.images.splice(index, 0, {
            id: imageId,
            src: image.url,
            processed: true
          })
        })
        .catch(() => {
          this.images = this.images.filter(image => image.id !== imageId)
          this.images.splice(index, 0, {
            id: imageId,
            processed: true,
            error: true
          })
        })
    }
  }

</script>
