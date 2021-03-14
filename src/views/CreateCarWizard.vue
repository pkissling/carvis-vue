<template>
  <b-container fluid>
    <h1>Hinzufügen</h1>
    <b-form @submit="onSubmit" @reset="onReset">
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
        label="Ein optionales Feld:"
        label-for="optional"
      >
        <b-form-input
          v-model="form.optional"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" :disabled="!canSubmit">Speichern</b-button>
      <b-button type="reset" :disabled="!canReset" variant="light">Zurücksetzen</b-button>
    </b-form>
  </b-container>
</template>

<script>
import CreateCar from '../mutations/CreateCar'
import ListCars from '../queries/ListCars'

export default {
  name: 'CreateCarWizard',
  data () {
    return {
      form: {
        brand: '',
        color: '',
        optional: ''
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
        this.form.optional
    }
  },
  methods: {
    onReset() {
      this.form.brand = ''
      this.form.color = ''
    },
    onSubmit() {
      this.$apollo.mutate({
        mutation: CreateCar,
        variables: this.form,
        update: (cache, { data: { carCreated } }) => {
          const data = cache.readQuery({ query: ListCars })
          data.listCars.items.push(carCreated)
          cache.writeQuery({ query: ListCars, data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          carCreated: {
            __typename: 'Car',
            id: new Date(),
            brand: this.form.brand,
            color: this.form.color
          }
        },
      })
    }
  }
}
</script>
