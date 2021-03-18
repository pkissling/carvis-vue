<template>
  <div>
    <b-container fluid>

      <h1>Fahrzeuge</h1>
      <b-table
        :items="this.cars"
        :fields="this.fields"
        striped
        small
        hover
        bordered
        primary-key="id"
        @row-clicked="rowClicked"
      >
        <template #cell(actions)="row">
          <span v-if="canEdit(row.item.username)">
            <b-button size="sm" @click="editCar(row.item.id)" class="mr-2">Bearbeiten</b-button>
            <b-button size="sm" @click="deleteCar(row.item.id)" class="mr-2">Löschen</b-button>
          </span>
        </template>
      </b-table>
    </b-container>

     <fab :actions="fab.actions"
        :main-icon="fab.mainIcon"
        :bg-color="fab.bgColor"
        @create="createCar"
    ></fab>
  </div>

</template>

<script>
import ListCars from '../apollo/queries/ListCars'
import DeleteCar from '../apollo/mutations/DeleteCar'
import fab from 'vue-fab'

export default {
  components: {
    fab
  },
  data () {
    return {
      fields: [
        'brand',
        'color',
        'mileage',
        'actions'
      ],
      fab: {
        mainIcon: 'more_vert',
        actions: [
          {
            name: 'delete',
            icon: 'delete'
          },
          {
            name: 'edit',
            icon: 'mode'
          },
          {
            name: 'create',
            icon: 'add'
          },
        ]
      }
    }
  },
  methods: {
    canEdit(owner) {
      return this.$auth.user.sub === owner
    },
    editCar(id) {
      this.$router.push({ path: `/${id}/edit` })
    },
    rowClicked(car) {
      this.$router.push({ path: `/${car.id}`})
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
    },
    createCar(){
      this.$router.push({ path: '/add' })
    }
  },
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars.items,
      prefetch: true
    }
  }
}
</script>
