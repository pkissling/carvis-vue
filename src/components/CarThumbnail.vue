<template>
  <v-avatar color="grey lighten-1">
    <v-img
      v-if="imageId"
      :src="carThumbnails.find(thumbnail => thumbnail.id === imageId)"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          />
        </v-row>
      </template>
    </v-img>
    <v-icon v-else
            color="primary"
    >
      mdi-car
    </v-icon>
  </v-avatar>
</template>

<script>
export default {
  props: {
   carThumbnails: {
      type: Array,
      default: () => []
    },
    imageId: {
      type: String,
      default: null
    }
  }
}
</script>