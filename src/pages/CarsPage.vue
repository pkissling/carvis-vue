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
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      class="elevation-5"
      @click:row="viewCar"
    />

    <FloatingButton
      :loading="loading"
      :show="showFloatingButton"
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
      lastScrollTop: 0,
      sortBy: 'updatedAt',
      sortDesc: true,
      showFloatingButton: true,
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
        },
        {
          text: 'Letzte Änderung',
          sortable: true,
          value: 'updatedAt'
        }
      ]
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    viewCar (car) {
      this.$router.push({ path: `/${car.id}`})
    },
    createCar () {
      this.$router.push({ path: '/add' })
    },
    handleScroll (event) {
      var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      if (st > this.lastScrollTop){
          this.showFloatingButton = false
      } else {
          this.showFloatingButton = true
      }
      this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
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
