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
import UpdateCar from '../apollo/mutations/UpdateCar'
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
      this.$apollo.mutate({
        mutation: UpdateCar,
        variables: {
          updatecarinput: {
            // TODO remove unknown fields
            id: car.id,
            brand: car.brand,
            color: car.color,
            username: car.username,
            mileage: car.mileage
          }
        }
      })
      .then(() => this.$router.push({ path: '/cars' }))
    }
  }
}
</script>
