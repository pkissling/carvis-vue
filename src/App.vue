<template>
  <v-app>
    <TheNavBar />
    <v-main>
      <router-view />
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script>
import TheNavBar from './components/TheNavBar.vue'
import Snackbar from './components/Snackbar.vue'

export default {
  components: {
    TheNavBar,
    Snackbar
  }
}
</script>
