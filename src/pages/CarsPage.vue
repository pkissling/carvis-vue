<template>
  <v-container>
    <span class="text-h2">Fahrzeuge</span>
    <v-text-field
      v-model="search"
      prepend-icon="mdi-magnify"
      placeholder="Porsche Carrera"
      class="my-12"
      outlined
      clearable
    ></v-text-field>

  <v-data-table
    :headers="this.headers"
    :items="this.cars"
    :items-per-page="20"
    :loading="loading"
    :mobile-breakpoint="0"
    :search="search"
    @click:row="viewCar"
    class="elevation-5"
  >
  </v-data-table>

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
      search: '',
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
          text: 'Author',
          align: 'start',
          sortable: true,
          value: 'ownerUsername',
        }
      ]
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
      update: data => data.listCars.items,
      prefetch: true
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    }
  }
}
</script>
