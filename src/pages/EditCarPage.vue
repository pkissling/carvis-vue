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
import ListCars from '../apollo/queries/ListCars'
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
        },
        update(cache, { data: updateCar }) {
          const data = cache.readQuery({ query: ListCars })
          data.listCars.items = data.listCars.items.filter(car => car.id !== updateCar.updateCar.id)
          data.listCars.items = [...data.listCars.items, updateCar.updateCar]
          cache.writeQuery({ query: ListCars, data })
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateCar: {
            __typename: "Car",
            ...car
          }
        }
      })
      .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>
