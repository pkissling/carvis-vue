<template>
  <div>
    <h1>Create car</h1>
    <input v-model="input.brand" placeholder="brand" class="input">
    <input v-model="input.color" placeholder="color" class="input">
    <button @click="createCar()">Create car</button>
  </div>
</template>

<script>
import CreateCar from '../mutations/CreateCar'
import ListCars from '../queries/ListCars'

export default {
  name: 'CreateCarWizard',
  data () {
    return {
      input: {
        brand: '',
        color: ''
      }
    }
  },
  methods: {
    createCar() {
      this.$apollo.mutate({
        mutation: CreateCar,
        variables: this.input,
        update: (store, { data: { carCreated } }) => {
            const data = store.readQuery({ query: ListCars })
            data.listCars.items.push(carCreated)
            store.writeQuery({ query: ListCars, data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          carCreated: {
            __typename: 'Car',
            id: new Date(),
            ...this.createCarObj
          }
        },
      })
    }
  }
}
</script>

<style scoped>
</style>
