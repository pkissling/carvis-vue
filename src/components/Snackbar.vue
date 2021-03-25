<template>
  <v-snackbar v-model="show" :color="color">
    {{ message }}
    <v-btn text @click="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: ''
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