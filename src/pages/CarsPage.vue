<template>
  <v-container>
    <v-card>
      <v-card-title>
        Fahrzeuge
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Suchen"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="this.headers"
        :items="this.cars"
        :items-per-page="20"
        :loading="loading"
        :mobile-breakpoint="0"
        :search="search"
        @click:row="viewCar"
        class="elevation-5"
        dense
      >
      </v-data-table>

      <FloatingButton
        :loading="loading"
        @create-clicked="createCar"
      />
    </v-card>
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
        }
      ]
    }
  },
  methods: {
    viewCar (car) {
      if (car.username !== this.$auth.user.sub) {
        this.$router.push({ path: `/${car.id}`})
      } else {
        this.$router.push({ path: `/${car.id}/edit`})
      }
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
