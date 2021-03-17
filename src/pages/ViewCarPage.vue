<template>
  <b-container fluid>
    <h1>Anzeigen</h1>
    <CarDetailForm
      :car="this.car"
      :viewOnly="true"
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
  }
}
</script>
