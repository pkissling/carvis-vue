<template>
  <v-app-bar
    app
    color="primary"
  >
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />

      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
        width="100"
      />
    </div>

    <v-spacer />

    <v-btn
      v-if="showLogin"
      :loading="$auth.loading"
      dark
      elevation="2"
      color="primary"
      @click="login"
    >
      Login
    </v-btn>
    <v-btn v-else
           dark
           elevation="2"
           :loading="$auth.loading"
           color="accent"
           @click="logout"
    >
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  computed: {
    showLogin () {
      return !this.$auth.isAuthenticated
    }
  },
  methods: {
    login () {
      this.$auth.loginWithRedirect()
    },
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
