<template>
  <v-container>
    <span class="text-h2">Fahrzeuge</span>
    <v-text-field
      v-model="searchTerm"
      prepend-icon="mdi-magnify"
      placeholder="Porsche Carrera"
      class="my-12"
      outlined
      clearable
    />

    <v-data-table
      :headers="headers"
      :items="_cars"
      :items-per-page="20"
      :loading="loading"
      :mobile-breakpoint="0"
      :search="searchTerm"
      class="elevation-5"
      @click:row="viewCar"
    />

    <FloatingButton
      :loading="loading"
      @create-clicked="createCar"
    />
  </v-container>
</template>

<script>
import ListCars from '../apollo/queries/ListCars'
import FloatingButton from '../components/FloatingButton'
import { relativeTimeDifference } from '../utilities/time'

export default {
  components: {
    FloatingButton
  },
  data () {
    return {
      searchTerm: '',
      headers: [
        {
          text: 'Marke',
          align: 'start',
          value: 'brand',
        },
        {
          text: 'Typ',
          align: 'start',
          value: 'type',
        },
        {
          text: 'Modellreihe',
          align: 'start',
          value: 'modelSeries',
        },
        {
          text: 'Modelljahr',
          align: 'start',
          value: 'modelYear',
        },
        {
          text: 'Außenfarbe',
          align: 'start',
          value: 'colorExterior',
        },
        {
          text: 'Erstellt durch',
          align: 'start',
          value: 'ownerName',
        },
        {
          text: 'Zuletzt aktualisiert',
          sortable: false,
          value: 'lastChanged'
        }
      ]
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    },
    _cars () {
      if (!this.cars) {
        return []
      }

      return this.cars
        .map(car => {
          const lastChanged = relativeTimeDifference(car.updatedAt)
          return {
            lastChanged,
            ...car
          }
        })
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
  },
  methods: {
    viewCar (car) {
      this.$router.push({ path: `/cars/${car.id}`})
    },
    createCar () {
      this.$router.push({ path: '/cars/add' })
    }
  },
  apollo: {
    cars: {
      query: () => ListCars,
      update: data => data.listCars ? data.listCars.items : [],
      prefetch: true
    }
  }
}
</script>
