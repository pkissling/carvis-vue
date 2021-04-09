<template>
  <v-file-input
    multiple
    small-chips
    clearable
    prepend-icon="mdi-camera"
    truncate-length="15"
    accept="image/*"
    outlined
    :value="uploadedImages"
    :loading="loading"
    @change="onChange"
  />
</template>

<script>

//  <template v-slot:selection="{ index, name }">
    //   <v-img
    //     :src="src(index, name)"
    //     :lazy-src="layzSrc(index)"
    //     max-width="100"
    //     max-height="100"
    //   >
    //     <template
    //       v-slot:placeholder
    //     >
    //       <v-row
    //         class="fill-height ma-0"
    //         align="center"
    //         justify="center"
    //       >
    //         <v-progress-circular
    //           indeterminate
    //           color="grey lighten-5"
    //         />
    //       </v-row>
    //     </template>
    //   </v-img>
    // </template>
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
        .then(ids => {
          this.$emit('input', ids.concat(this.value))
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