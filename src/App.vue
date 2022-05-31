<template>
  <v-app>
    <TheNavBar
      v-if="!isHomePage"
      v-model="showNavbar"
    />
    <TheAppBar
      v-if="!isHomePage"
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

<script lang="ts">
import TheAppBar from '@/components/TheAppBar.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import Snackbar from '@/components/Snackbar.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { TheAppBar, TheNavBar, Snackbar }})
export default class App extends Vue {
  showNavbar = !this.isMobile

  get isHomePage(): boolean {
    return this.$route.path == '/'
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.smAndDown
  }
}
</script>
