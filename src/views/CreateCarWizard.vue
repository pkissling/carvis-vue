<template>
  <b-container fluid>
    <h1>Hinzufügen</h1>
    <b-form @reset="onReset" @submit.stop.prevent="onSubmit">
      <!-- brand -->
      <b-form-group
        label="Marke:"
        label-for="brand"
        description="Eine Beschreibung was hier genau verlangt wird."
      >
        <b-form-input
          v-model="form.brand"
          placeholder="Porsche"
          required
        ></b-form-input>
      </b-form-group>

      <!-- color -->
      <b-form-group
        label="Farbe:"
        label-for="color"
      >
        <b-form-input
          v-model="form.color"
          placeholder="Rostbraun"
          required
        ></b-form-input>
      </b-form-group>

      <!-- optional -->
      <b-form-group
        label="Kilometerstand"
        label-for="optional"
      >
        <b-form-input
          v-model="form.mileage"
          type=number
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" :disabled="!canSubmit">Speichern</b-button>
      <b-button type="reset" :disabled="!canReset" variant="light">Zurücksetzen</b-button>
    </b-form>
  </b-container>
</template>

<script>
import CreateCar from '../apollo/mutations/CreateCar'
import ListCars from '../apollo/queries/ListCars'

export default {
  name: 'CreateCarWizard',
  data () {
    return {
      form: {
        brand: null,
        color: null,
        mileage: null
      }
    }
  },
  computed: {
    canSubmit () {
      return this.form.brand &&
        this.form.color
    },
    canReset () {
      return this.form.brand ||
        this.form.color ||
        this.form.mileage
    }
  },
  methods: {
    onReset() {
      this.form.brand = null
      this.form.color = null
      this.form.mileage = null
    },
    onSubmit() {
      this.$apollo.mutate({
        mutation: CreateCar,
        variables: {
          createcarinput: this.form
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
            ...this.form
          }
        }
      })
      .then(() => this.$router.push({ path: '/cars' }))
    }
  }
}
</script>
