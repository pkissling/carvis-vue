<template>
  <v-container
    v-if="currentImagePosition && imagesCount"
    class="fill-height"
  >
    <v-row class="fill-height">
      <v-col
        class="v-carousel__controls"
        align-self="end"
        align="center"
      >
        <p class="pt-4 font-weight-medium">
          {{ currentImagePosition }} / {{ imagesCount }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    imagesCount: {
      type: Number,
      default: 0
    },
    currentImagePosition: {
      type: Number,
      default: 0
    }
  }
}
</script>
