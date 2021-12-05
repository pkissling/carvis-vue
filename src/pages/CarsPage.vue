<template>
  <OverviewTable
    title="Fahrzeuge"
    search-placeholder-text="Porsche Carrera"
    :headers="headers"
    :items="cars"
    :loading="loading"
    @row-clicked="viewCar"
    @create-clicked="createCar"
  >
    <template v-slot="item">
      <CarThumbnail
        :image-id="item.proxiedProps.previewImageId"
      />
    </template>
  </OverviewTable>
</template>

<script>
import notificationService from '../service/notification-service'
import CarThumbnail from '../components/CarThumbnail.vue'
import OverviewTable from '../components/OverviewTable.vue'
import { relativeTimeDifference } from '../utilities/time'

export default {
  components: {
    OverviewTable,
    CarThumbnail
  },
  data () {
    return {
      searchTerm: '',
      carThumbnails: [],
      headers: [
        {
          sortable: false,
          value: 'preview'
        },
        {
          text: 'Marke',
          value: 'brand',
        },
        {
          text: 'Typ',
          align: 'start',
          value: 'type',
        },
        {
          text: 'Modellreihe',
          value: 'modelSeries',
        },
        {
          text: 'Modelljahr',
          value: 'modelYear',
        },
        {
          text: 'Außenfarbe',
          value: 'colorExterior',
        },
        {
          text: 'Erstellt durch',
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
      return this.$auth.loading || this.$store.getters['common/isLoading']
    },
    cars () {
      return this.$store.getters['cars/allCars']
        .map(car => {
          const lastChanged = relativeTimeDifference(car.updatedAt)
          const previewImageId = car.images ? car.images[0] : null
          return {
            previewImageId,
            lastChanged,
            ...car
          }
        })
    }
  },
  created () {
    this.$store.dispatch('cars/fetchAllCars')
      .catch(err => notificationService.error('Fehler beim Lesen der Fahrzeug. Bitte versuche es erneut.', err))
  },
  methods: {
    viewCar (car) {
      this.$router.push({ path: `/cars/${car.id}`})
    },
    createCar () {
      this.$router.push({ path: '/cars/add' })
    }
  }
}
</script>
