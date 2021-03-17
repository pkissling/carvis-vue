<template>
  <div id="app">
    <TheNavBar />
    <router-view/>
  </div>
</template>

<script>
import TheNavBar from './components/TheNavBar.vue'

export default {
  components: {
    TheNavBar
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
</style>
