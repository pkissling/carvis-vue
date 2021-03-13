<template>
  <div id="app">
    <div class="nav">
      <router-link v-if="showHome" to="/">Home</router-link> |
      <router-link v-if="showList" to="/list">List</router-link> |
      <router-link v-if="showAdd" to="/add">Add</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  computed: {
    showHome() {
      return true
    },
    showList() {
      return this.$auth.isAuthenticated
    },
    showAdd() {
      return this.$auth.isAuthenticated
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

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
</style>
