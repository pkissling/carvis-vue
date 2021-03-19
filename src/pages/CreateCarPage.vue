<template>
  <v-container>
    <h1>Hinzufügen</h1>
    <CarDetailForm
      :car="this.car"
      @submit="createCar(car)"
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
      car: {
        brand: null,
        color: null,
        mileage: null
      }
    }
  },
  methods: {
    createCar(car) {
      carService.createCar(car)
        .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>
