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
      // remove fields which are not part of the schema. (_type)
      // otherwise apollo will refuse the update
      Object.keys(car)
        .filter(attr => attr.startsWith('__typename'))
        .forEach(attr => delete car[attr])
      this.$apollo.mutate({
        mutation: UpdateCar,
        variables: {
          updatecarinput: car
        }
      })
      .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>
