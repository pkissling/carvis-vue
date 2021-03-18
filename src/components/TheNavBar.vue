<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="'/'">Blumenerde</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- right -->
        <b-navbar-nav class="ml-auto">
          <b-button v-if="showLogin" @click="login">Login</b-button>
          <b-button v-else @click="logout">Logout</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'TheNavBar',
  computed: {
    showHome () {
      return true
    },
    showList () {
      return this.$auth.isAuthenticated
    },
    showAdd () {
      return this.$auth.isAuthenticated
    },
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

<style scoped>

</style>