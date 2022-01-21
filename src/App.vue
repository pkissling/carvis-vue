<template>
  <v-app>
    <TheNavBar v-if="!isHomePage"
               v-model="showNavbar"
    />
    <TheAppBar v-if="!isHomePage"
               v-model="showNavbar"
    />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script>
import TheAppBar from '@/components/TheAppBar.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import Snackbar from '@/components/Snackbar.vue'

export default {
  components: {
    TheAppBar,
    TheNavBar,
    Snackbar
  },
  data() {
    return {
      showNavbar: true
    }
  },
  computed: {
    isHomePage() {
      return this.$route.path == '/'
    }
  }
}
</script>
