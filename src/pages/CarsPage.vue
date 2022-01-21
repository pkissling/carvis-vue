<template>
  <Page title="Fahrzeuge">
    <OverviewTable
      search-placeholder-text="Porsche Carrera"
      :headers="headers"
      :items="cars"
      :loading="loading"
      @row-clicked="viewCar"
      @create-clicked="createCar"
    >
      <template v-slot="item">
        <CarThumbnail :image-id="item.proxiedProps.previewImageId" />
      </template>
    </OverviewTable>
  </Page>
</template>

<script>
import Page from '@/pages/Page.vue'
import CarThumbnail from '@/components/CarThumbnail.vue'
import OverviewTable from '@/components/OverviewTable.vue'
import { relativeTimeDifference } from '@/utilities/time'
import { carsStore, commonStore, notificationsStore } from '@/store'

export default {
  components: {
    OverviewTable,
    CarThumbnail,
    Page
  },
  data() {
    return {
      headers: [
        {
          sortable: false,
          value: 'preview'
        },
        {
          text: 'Marke',
          value: 'brand'
        },
        {
          text: 'Typ',
          align: 'start',
          value: 'type'
        },
        {
          text: 'Modellreihe',
          value: 'modelSeries'
        },
        {
          text: 'Modelljahr',
          value: 'modelYear'
        },
        {
          text: 'Außenfarbe',
          value: 'colorExterior'
        },
        {
          text: 'Erstellt durch',
          value: 'ownerName'
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
    loading() {
      return this.$auth.loading || commonStore.isLoading
    },
    cars() {
      return carsStore.cars.map(car => {
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
  async created() {
    carsStore.fetchAllCars().catch(err =>
      notificationsStore.error({
        message: 'Fehler beim Laden der Fahrzeug. Bitte versuche es erneut.',
        err
      })
    )
  },
  methods: {
    viewCar(car) {
      this.$router.push({ path: `/cars/${car.id}` })
    },
    createCar() {
      this.$router.push({ path: '/cars/add' })
    }
  }
}
</script>
