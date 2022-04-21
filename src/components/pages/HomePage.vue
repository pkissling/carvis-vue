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

    <v-card
      class="mx-auto mt-4"
      max-width="374"
      elevation="5"
    >
      <v-card-actions>
        <v-container>
          <v-row>
            <v-col
              cols="6"
              align="left"
            >
              <v-btn
                :loading="isLoading || isLoggedin"
                color="primary"
                @click="$auth.loginWithRedirect()"
              >
                Login
              </v-btn>
            </v-col>
            <v-col
              cols="6"
              align="right"
            >
              <v-btn
                :loading="isLoading || isLoggedin"
                text
                @click="$auth.loginWithRedirect({ screen_hint: 'signup' })"
              >
                Registrieren
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { userStore } from '@/store'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class HomePage extends Vue {

  get isLoading(): boolean {
    return this.$auth.loading
  }

  get isLoggedin(): boolean {
    return this.$auth.isAuthenticated || false
  }

  get hasAccess(): boolean {
    return userStore.hasAccess
  }

  @Watch('isLoading')
  async redirectIfLoggedIn(): Promise<void> {
    if (!this.isLoading && !this.isLoggedin) {
      return
    }

    const path = this.hasAccess ? '/cars' : '/forbidden'
    await this.$router.push({ path })
  }
}
</script>
