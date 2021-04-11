<template>
  <v-row
    justify="center"
  >
    <v-dialog
      v-model="dialog"
      @click:outside="onClickOutside"
    >
      <v-img
        contain
        :src="src"
        :lazy-src="image.src"
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
    </v-dialog>
  </v-row>
</template>

<script>
import imageService from '../service/image-service'

export default {
  props: {
    image: {
      type: Object,
      default: null
    }
  }
  ,
  data () {
    return {
      dialog: true,
      src: null
    }
  },
  async created() {
    imageService.fetchImageUrl(this.image.id)
      .then(url => this.src = url)
  },
  methods: {
    onClickOutside () {
      this.$emit('cancel')
    }
  }
}
</script>