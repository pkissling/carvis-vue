<template>
  <v-col>
    <v-file-input
      multiple
      small-chips
      counter
      clearable
      truncate-length="15"
      accept="image/*"
      outlined
      prepend-icon=""
      label="Fahrzeugbilder"
      :value="uploadedImages"
      :loading="loading"
      @change="onChange"
    />
  </v-col>
</template>

<script>
import imageService from '../service/image-service'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      uploadedImages: []
    }
  },
  methods: {
    async onChange (files) {
      const unchanged = this.uploadedImages.length === files.length && this.uploadedImages.every((v, i) => v === files[i]);
      if (unchanged) {
        return
      }

      this.loading = true
      const uploadPromises = files.map(file => imageService.uploadImage(file))
      Promise.all(uploadPromises)
        .then(imageIds => {
          const input = this.value ? [ ...imageIds, ...this.value] : imageIds
          this.$emit('input', input)
          this.uploadedImages.push(...files)
        })
        .finally(() => this.loading = false)
    },
    createImagePreview (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.uploadQueue.push({ name: file.name, loading: true, blob: event.target.result})
      }
      reader.readAsDataURL(file)
    },
    src(index, name) {
     if (!this.images || !this.images[index]) {
        return undefined
      }

      const image = this.images[index]
      return image.loading ? '' : image.blob
    },
    layzSrc(index) {
      if (!this.images || !this.images[index]) {
        return undefined
      }

      return this.images[index].blob
    }
  }
}
</script>