<template>
  <v-card
    :loading="loading"
    class="my-12"
  >
    <v-card-title class="text-h4">
      Fahrzeugbilder
    </v-card-title>
    <v-card-text>
      <UploadedImagesPreview
        v-model="value"
      />
      <v-row>
        <v-col>
          <v-file-input
            :value="images"
            multiple
            outlined
            clearable
            label="Bilder hinzufügen..."
            truncate-length="10"
            @change="onFileUpload"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import UploadedImagesPreview from './UploadedImagesPreview'
import imageService from '../service/image-service'

export default {
  components: {
    UploadedImagesPreview
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
      loading: false
    }
  },
  methods: {
    async onFileUpload(files) {
      this.loading = true

      // 1 populate to internal with lazy-src
      // 2 start upload
      // on finish, replace internal image with url & emit input
      Promise.all(files.map(file => imageService.uploadImage(file)))
        .then(ids => this.$emit('input', [...this.value, ...ids]))
    }
  }
}
</script>