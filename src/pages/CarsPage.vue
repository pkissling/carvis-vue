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
      :show="floatingButton.show"
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
      floatingButton: {
        show: true,
        lastScrollTop: 0,
      },
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
          text: 'Zuletzt geändert',
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
          const lastChanged = this.timeDifference(car.updatedAt)
          return {
            lastChanged,
            ...car
          }
        })
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
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
      var st = window.pageYOffset || document.documentElement.scrollTop
      if (st > this.floatingButton.lastScrollTop) {
          this.floatingButton.show = false
      } else {
          this.floatingButton.show = true
      }
      this.floatingButton.lastScrollTop = st <= 0 ? 0 : st
    },
    timeDifference(updatedAt) {

      const msPerMinute = 60 * 1000;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const msPerMonth = msPerDay * 30;
      const msPerYear = msPerDay * 365;

      const current = Date.now();
      const timestamp = Date.parse(updatedAt)
      const elapsed = current - timestamp;

      const rtf = new Intl.RelativeTimeFormat("de", { numeric: "auto" });

      if (elapsed < msPerMinute) {
          return rtf.format(-Math.floor(elapsed/1000), 'seconds');
      }

      else if (elapsed < msPerHour) {
          return rtf.format(-Math.floor(elapsed/msPerMinute), 'minutes');
      }

      else if (elapsed < msPerDay) {
          return rtf.format(-Math.floor(elapsed/msPerHour), 'hours');
      }

      else if (elapsed < msPerMonth) {
        return rtf.format(-Math.floor(elapsed/msPerDay), 'days');
      }

      else if (elapsed < msPerYear) {
        return rtf.format(-Math.floor(elapsed/msPerMonth), 'months');
      }

      else {
          return new Date(timestamp).toLocaleDateString("de");
      }
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
