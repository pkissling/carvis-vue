<template>
  <div>
    <v-row
      v-if="title"
    >
      <v-col
        class="text-h2"
        align="center"
      >
        {{ title }}
      </v-col>
    </v-row>
    <v-row>
      <v-col
        align="center"
        class="body-1"
      >
        <slot />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    }
  },

}
</script>
