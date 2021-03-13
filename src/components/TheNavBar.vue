<template>
  <div class="nav">
    <router-link v-if="showHome" to="/">Home</router-link>
    <span v-if="showList">
       | <router-link to="/list">List</router-link>
    </span>
    <span v-if="showAdd">
      | <router-link to="/add">Add</router-link>
    </span>
    <span>
      |
      <a v-if="showLogin" @click="login()">Login</a>
      <a v-else @click="logout()">Logout</a>
    </span>

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
.nav {
  padding: 30px;
}

.nav a {
  font-weight: bold;
  color: #2c3e50;
}

.nav a.router-link-exact-active {
  color: #42b983;
}

a {
  text-decoration: underline;
  cursor: pointer;
}
</style>