<template>
  <v-app-bar app>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="@/assets/images/logo_250px.png"
        transition="scale-transition"
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
    <v-btn
      v-else
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
