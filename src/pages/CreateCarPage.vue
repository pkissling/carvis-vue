<template>
  <b-container fluid>
    <h1>Hinzufügen</h1>
    <CarDetailForm
      :car="this.car"
      @submit="saveCar(car)"
    />
  </b-container>
</template>

<script>
import CreateCar from '../apollo/mutations/CreateCar'
import ListCars from '../apollo/queries/ListCars'
import CarDetailForm from '../components/CarDetailForm'

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
    saveCar(car) {
      this.$apollo.mutate({
        mutation: CreateCar,
        variables: {
          createcarinput: car
        },
        update(cache, { data: createCar }) {
          const data = cache.readQuery({ query: ListCars })

          // somehow this method is called 3 times.
          // 1x for optimisticResponse, 2x for actual response.
          const isDuplicated = data.listCars.items.map(car => car.id).some(id => createCar.createCar.id === id)
          if (isDuplicated) {
            return
          }

          if (createCar.createCar.id.startsWith('optimistic')) {
            // add optimistic response to data
            data.listCars.items = [...data.listCars.items, createCar.createCar]
          } else {
            // replace actual response with optimistic response
            data.listCars.items = data.listCars.items.filter(car => !car.id.startsWith('optimistic'))
            data.listCars.items = [...data.listCars.items, createCar.createCar]
          }
          cache.writeQuery({ query: ListCars, data })
        },
        optimisticResponse: {
          __typename: "Mutation",
          createCar: {
            id: 'optimistic' + new Date().getTime(),
            __typename: "Car",
            username: this.$auth.user.sub,
            ...car
          }
        }
      })
      .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>
