<template>
  <div>
    <v-card class="mx-auto mt-12"
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
    </v-card>

    <NavigationCard :loading="isLoading"
                    :items="navigationItems"
    />
  </div>
</template>

<script>
import NavigationCard from '@/components/NavigationCard'
import { userStore } from '@/store'

export default {
  components: {
    NavigationCard
  },
  computed: {
    isLoading() {
      return this.$auth.loading
    },
    isLoggedin() {
      return this.$auth.isAuthenticated
    },
    navigationItems() {
      if (!this.isLoggedin) {
        return [
          {
            text: 'Login',
            color: 'primary',
            action: () => this.$auth.loginWithRedirect()
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
  },
  mounted() {
    if (this.isLoggedin && !userStore.hasAccess) {
      this.$router.push({ path: '/forbidden' })
    }
  }
}
</script>
