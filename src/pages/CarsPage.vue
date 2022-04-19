<template>
  <Page title="Fahrzeuge">
    <OverviewTable
      search-placeholder-text="Porsche Carrera"
      :search-term="searchTerm"
      :default-headers="headers"
      :items="cars"
      :loading="loading"
      @search-term-changed="onSearchTermChanged"
      @row-clicked="viewCar"
      @create-clicked="createCar"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/pages/Page.vue'
import OverviewTable from '@/components/OverviewTable.vue'
import { relativeTimeDifference } from '@/utilities/time'
import { carsStore, commonStore, notificationsStore } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { OverviewTable, Page } })
export default class CarsPage extends Vue {

  headers: HighlightableDataTableHeader[] = [
    {
      forceShow: true,
      value: 'previewImageId',
      priority: 0
    },
    {
      value: 'brand',
      priority: 0
    },
    {
      value: 'type',
      priority: 0
    },
    {
      value: 'modelSeries',
      priority: 0
    },
    {
      value: 'modelYear',
      priority: 0
    },
    {
      value: 'colorExterior',
      priority: 0
    },
    {
      value: 'ownerName',
      priority: 2
    },
    {
      sortable: false,
      value: 'lastChanged',
      priority: 2
    }
  ]

  get searchTerm(): string {
    return carsStore.searchTerm
  }

  get loading(): boolean {
    return this.$auth.loading || commonStore.isLoading
  }

  get cars(): CarDto[] {
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

  async created(): Promise<void> {
    carsStore.fetchAllCars().catch(err =>
      notificationsStore.error({
        message: 'Fehler beim Laden der Fahrzeug. Bitte versuche es erneut.',
        err
      })
    )
  }

  viewCar(car: CarDto): void {
    this.$router.push({ path: `/cars/${car.id}` })
  }

  createCar(): void {
    this.$router.push({ path: '/cars/add' })
  }

  onSearchTermChanged(searchTerm: string): void {
    carsStore.setSearchTerm(searchTerm)
  }
}
</script>
