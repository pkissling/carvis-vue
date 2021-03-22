<template>
  <v-container>
    <h1>Hinzufügen</h1>
    <CarDetailForm
      :car="this.car"
      @submit="createCar"
    />
  </v-container>
</template>

<script>
import CarDetailForm from '../components/CarDetailForm'
import carService from '../service/car-service'

export default {
  components: {
    CarDetailForm
  },
  data () {
    return {
      car: {}
    }
  },
  methods: {
    createCar(car) {
      // eslint-disable-next-line no-debugger
      debugger
      carService.createCar(car)
        .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>
