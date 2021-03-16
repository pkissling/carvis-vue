<template>
  <b-container fluid>
    <h1>Fahrzeuge</h1>
      <b-table
        :items="this.cars"
        :fields="this.fields"
        striped
        small
        primary-key="id"
        :busy="$apollo.loading"
      >
        <template #cell(action)="row">
         <span v-if="canEdit(row.item.username)">
            <b-button size="sm" class="mr-2">Bearbeiten</b-button>
            <b-button size="sm" class="mr-2">Löschen</b-button>
         </span>
        </template>
      </b-table>

      {{ allFields }}

  </b-container>
</template>

<script>
import ListCars from '../queries/ListCars'
import ListCarFields from '../queries/ListCarFields'

export default {
  name: 'CarsTable',
  data() {
    return {
      fields: [
        { key: 'brand', sortable: true },
        { key: 'color', sortable: true },
        { key: 'mileage', sortable: true },
        { key: 'action'}
      ]
    }
  },
  methods: {
    canEdit(owner) {
      return this.$auth.user.sub === owner
    }
  },
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars.items,
      prefetch: true
    },
    allFields: {
      query: () => ListCarFields,
      update: data => data.__type.fields.map(f => f.name)
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
