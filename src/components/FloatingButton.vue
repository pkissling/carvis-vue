<template>
  <v-speed-dial fab
                fixed
                bottom
                right
  >
    <template v-slot:activator>
      <v-fab-transition>
        <v-btn
          :loading="loading"
          color="primary"
          fab
          @click="$emit('create-clicked')"
        >
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
  </v-speed-dial>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
