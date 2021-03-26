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
      :items="cars"
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
          sortable: true,
          value: 'brand',
        },
        {
          text: 'Typ',
          align: 'start',
          sortable: true,
          value: 'type',
        },
        {
          text: 'Modellreihe',
          align: 'start',
          sortable: true,
          value: 'modelSeries',
        },
        {
          text: 'Modelljahr',
          align: 'start',
          sortable: true,
          value: 'modelYear',
        },
        {
          text: 'Außenfarbe',
          align: 'start',
          sortable: true,
          value: 'colorExterior',
        },
        {
          text: 'Besitzer',
          align: 'start',
          sortable: true,
          value: 'ownerName',
        }
      ]
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    }
  },
  methods: {
    viewCar (car) {
      this.$router.push({ path: `/${car.id}`})
    },
    createCar () {
      this.$router.push({ path: '/add' })
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
