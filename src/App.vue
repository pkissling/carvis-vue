<template>
  <v-app :style="{ background }">
    <TheNavBar
      v-if="showNavigation"
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
      <TheSnackbar />
    </v-main>
    <FloatingButton />
    <TheModalHome />
  </v-app>
</template>

<script lang="ts">
import TheAppBar from '@/components/TheAppBar.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import TheSnackbar from '@/components/TheSnackbar.vue'
import TheModalHome from '@/components/modals/TheModalHome.vue'
import FloatingButton from '@/components/FloatingButton.vue'
import { Component, Vue } from 'vue-property-decorator'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'

@Component({ components: { TheAppBar, TheNavBar, TheSnackbar, FloatingButton, TheModalHome }})
export default class App extends Vue {
  showNavbar = !this.isMobile

  get isHomePage(): boolean {
    return this.$route.path == '/'
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.smAndDown
  }

  get showNavigation(): boolean {
    return this.$route.meta?.requiresRole !== undefined
  }

  get background(): VuetifyThemeItem | undefined {
    const theme = this.$vuetify.theme.dark ? 'dark' : 'light'
    return this.$vuetify.theme.themes[theme].background
  }
}
</script>
