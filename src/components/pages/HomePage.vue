<template>
  <div>
    <CarvisCard
      class="mx-auto mt-12"
      max-width="374"
      elevation="5"
    >
      <v-img
        alt="Carvis"
        class="pa-4 ma-4"
        contain
        src="@/assets/images/logo_500px.png"
        lazy-src="@/assets/images/logo_250px.png"
      />

      <v-card-text>
        Carvis ist eine Cloud-B2B-Plattform für den Austausch von
        Fahrzeugangeboten und -gesuchen zwischen Händlern und Vermittlern.
        <br><br>
        Interessiert? Dann registriere Dich!
      </v-card-text>
    </CarvisCard>

    <NavigationCard
      :loading="isLoading"
      :items="navigationItems"
    />
  </div>
</template>

<script lang="ts">
import NavigationCard from '@/components/NavigationCard.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { NavigationCard }})
export default class HomePage extends Vue {

  get isLoading(): boolean {
    return this.$auth.loading
  }

  get isLoggedin(): boolean {
    return this.$auth.isAuthenticated || false
  }

  get navigationItems(): { text: string, color?: string, action: () => void }[] {
    if (!this.isLoggedin) {
      return [
        {
          text: 'Login',
          color: 'primary',
          action: () => this.$auth.loginWithRedirect({ appState: { targetUrl: '/cars' }})
        },
        {
          text: 'Registrieren',
          action: () =>
            this.$auth.loginWithRedirect({ screen_hint: 'signup' })
        }
      ]
    }

    return [
      {
        text: 'Fahrzeuge',
        color: 'primary',
        action: () => this.$router.push({ path: '/cars' })
      },
      {
        text: 'Gesuche',
        color: 'primary',
        action: () => this.$router.push({ path: '/requests' })
      }
    ]
  }
}
</script>
