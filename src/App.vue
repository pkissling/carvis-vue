<template>
  <v-app>
    <TheNavBar />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import TheNavBar from './components/TheNavBar.vue'

export default {
  components: {
    TheNavBar
  }
}
</script>
