<template>
  <div
    v-if="imagesCount && currentImagePosition"
    class="v-carousel__controls"
    align-self="end"
    align="center"
  >
    <p class="pt-4 font-weight-medium">
      {{ currentImagePosition }} / {{ imagesCount }}
    </p>
  </div>
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
