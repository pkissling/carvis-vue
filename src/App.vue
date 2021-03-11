<template>
  <div id="app" v-if="hydrated">
    <img alt="Vue logo" src="./assets/logo.png">
    <CreateCarWizard />
    <CarsTable />
  </div>
</template>

<script>
import CarsTable from './components/CarsTable.vue'
import CreateCarWizard from './components/CreateCarWizard.vue'

export default {
  name: 'App',
  data: () => ({ hydrated: false }),
  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;
  },
  components: {
    CreateCarWizard,
    CarsTable
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
  margin-top: 60px;
}
</style>
