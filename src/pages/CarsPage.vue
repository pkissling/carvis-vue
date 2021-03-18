<template>
  <v-container>
    <h1>Fahrzeuge</h1>
    <v-data-table
      :headers="this.headers"
      :items="this.cars"
      :items-per-page="20"
      :loading="loading"
      class="elevation-5"
    >
      <template v-slot:item.controls="props">
        <div v-if="canEdit(props.item)">
          <v-icon @click="editCar(props.item)">mdi-pencil</v-icon>
          <v-icon @click="triggerDeleteCar(props.item)">mdi-delete</v-icon>
        </div>
      </template>
    </v-data-table>

    <FloatingButton
      :loading="loading"
      @create-clicked="createCar"
    />

    <DeleteModal
      :car="carToDelete"
      @delete="deleteCar"
      @cancel="carToDelete = null"
    />
  </v-container>
</template>

<script>
import ListCars from '../apollo/queries/ListCars'
import FloatingButton from '../components/FloatingButton'
import DeleteModal from '../modals/DeleteModal'
import carService from '../service/car-service'

export default {
  components: {
    FloatingButton,
    DeleteModal
  },
  data () {
    return {
      carToDelete: null,
      allHeaders: [
        {
          text: 'Marke',
          align: 'start',
          sortable: true,
          value: 'brand',
        },
        {
          text: 'Farbe',
          align: 'start',
          sortable: true,
          value: 'color',
        },
        {
          text: 'Kilometerstand',
          align: 'start',
          sortable: true,
          value: 'mileage',
        },
        {
          text: 'Besitzer',
          align: 'start',
          sortable: true,
          value: 'username',
        },
        {
          text: 'Bearbeiten',
          value: 'controls',
          sortable: false
        }
      ]
    }
  },
  methods: {
    canEdit(car) {
      if (!car) return false
      return this.$auth.user.sub === car.username
    },
    editCar(car) {
      this.$router.push({ path: `/${car.id}/edit` })
    },
    viewCar(car) {
      this.$router.push({ path: `/${car.id}`})
    },
    triggerDeleteCar(car) {
      this.carToDelete = car
    },
    deleteCar(car) {
      this.carToDelete = null
      carService.deleteCar(car)
        .then(() => this.carToDelete = null)
    },
    createCar () {
      this.$router.push({ path: '/add' })
    }
  },
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars.items,
      prefetch: true
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    },
    headers () {
      if (!this.cars) return []
      const canEdit = this.cars.map(car => car.username).some(username => username === this.$auth.user.sub)
      return canEdit ? this.allHeaders : this.allHeaders.filter(header => header.value !== 'controls')
    }
  }
}
</script>
