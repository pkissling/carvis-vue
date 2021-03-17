<template>
  <b-container fluid>
    <h1>Bearbeiten</h1>
    <CarDetailForm
      :car="this.car"
      @submit="updateCar(car)"
    />
  </b-container>
</template>

<script>
import GetCar from '../apollo/queries/GetCar'
import CarDetailForm from '../components/CarDetailForm'

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
      console.log(`TODO update car ${car.id}`)
    }
  }
}
</script>
