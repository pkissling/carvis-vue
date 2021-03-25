<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
    outlined
    bottom
    transition="scale-transition"
    elevation="24"
    @click="show = false"
  >
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        :color="color"
        @click="show = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: '',
      timeout: 5000
    }
  },

  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'notifications/showMessage') {
        this.message = state.notifications.message
        this.color = state.notifications.color
        this.show = true
      }
    })
  }
}
</script>