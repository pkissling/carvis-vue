<template>
  <div>
    <h1>Create car</h1>
    <input v-model="createCarObj.brand" placeholder="brand" class="input">
    <input v-model="createCarObj.color" placeholder="color" class="input">
    <button @click="createCar()" class="taskButton">Create car</button>
  </div>
</template>

<script>
import CreateCar from '../mutations/CreateCar'
import ListCars from '../queries/ListCars'

export default {
  name: 'CreateCarWizard',
  data () {
    return {
      createCarObj: {
        brand: '',
        color: ''
      }
    }
  },
  methods: {
    createCar() {
        this.$apollo.mutate({
            mutation: CreateCar,
            variables: this.createCarObj,
            update: (store, { data: { createCar } }) => {
                this.$emit('create-car', createCar)
                const data = store.readQuery({ query: ListCars })
                data.listCars.items.push(createCar)
                store.writeQuery({ query: ListCars, data })
            },
            optimisticResponse: {
                __typename: 'Mutation',
                createCar: {
                    __typename: 'Car',
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
