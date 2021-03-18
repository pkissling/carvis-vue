<template>
  <v-container>
    <h1>Bearbeiten</h1>
    <CarDetailForm
      :car="this.car"
      @submit="updateCar(car)"
    />
  </v-container>
</template>

<script>
import GetCar from '../apollo/queries/GetCar'
import CarDetailForm from '../components/CarDetailForm'
import carService from '../service/car-service'

export default {
  components: {
    CarDetailForm
  },
  props: [
    'carId'
  ],
  apollo: {
    car: {
      query: () => GetCar,
      update: data => data.getCar,
      variables () {
        return {
          id: this.carId,
        }
      },
      prefetch: true
    }
  },
  methods: {
    updateCar(car) {
      carService.updateCar(car)
        .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>
