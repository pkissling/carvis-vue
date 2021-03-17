<template>
  <b-container fluid>

    <h1>Fahrzeuge</h1>
    <b-table
      :items="this.cars"
      :fields="this.filteredFields"
      striped
      small
      hover
      bordered
      primary-key="id"
      @row-clicked="rowClicked"
    >
      <template #cell(action)="row">
        <span v-if="canEdit(row.item.username)">
          <b-button size="sm" @click="editCar(row.item.id)" class="mr-2">Bearbeiten</b-button>
          <b-button size="sm" @click="deleteCar(row.item.id)" class="mr-2">Löschen</b-button>
        </span>
      </template>
    </b-table>

    <h2>Filters</h2>
    <b-form-group>
      <b-form-checkbox v-for="field in fields"
        :key="field"
        v-model="deselectedFields"
        :value="field"
        inline
      >
        {{ field }}
      </b-form-checkbox>
    </b-form-group>
  </b-container>
</template>

<script>
import ListCars from '../apollo/queries/ListCars'
import DeleteCar from '../apollo/mutations/DeleteCar'
import ListCarFields from '../apollo/queries/ListCarFields'

export default {
  data() {
    return {
      deselectedFields: [],
      mandatoryFields: [
        'action'
      ]
    }
  },
  methods: {
    canEdit(owner) {
      return this.$auth.user.sub === owner
    },
    editCar(id) {
      this.$router.push({ path: `/cars/${id}/edit` })
    },
    rowClicked(car) {
      this.$router.push({ path: `/cars/${car.id}`})
    },
    deleteCar(id) {
      this.$apollo.mutate({
        mutation: DeleteCar,
        variables: { id },
        update(cache, { data: deleteCar }) {
          const data = cache.readQuery({ query: ListCars })
          data.listCars.items = data.listCars.items.filter(car => car.id !== deleteCar.deleteCar.id)
          cache.writeQuery({ query: ListCars, data })
        },
        optimisticResponse: {
          __typename: "Mutation",
          deleteCar: {
            id,
            __typename: "Car"
          }
        }
      })
    }
  },
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars.items,
      prefetch: true
    },
    fields: {
      query: () => ListCarFields,
      update: data => data.__type.fields.map(f => f.name)
    }
  },
  computed: {
    filteredFields() {
      if (!this.fields) {
        return []
      }
      const filteredFields = this.fields.filter(f => !this.deselectedFields.includes(f))
      return [...filteredFields, 'action' ]
    }
  }
}
</script>

<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
