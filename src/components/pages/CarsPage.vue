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
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/components/pages/Page.vue'
import OverviewTable from '@/components/OverviewTable.vue'
import { carsStore, notificationsStore } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { OverviewTable, Page } })
export default class CarsPage extends Vue {

  loading = false
  headers: HighlightableDataTableHeader[] = [
    {
      forceShow: true,
      value: 'previewImageId',
      priority: 0,
      sortable: false
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
      value: 'updatedAt',
      priority: 2
    }
  ]

  get searchTerm(): string {
    return carsStore.searchTerm
  }

  get cars(): CarDto[] {
    return carsStore.cars.map(car => {
      const previewImageId = car.images ? car.images[0] : null
      return {
        previewImageId,
        ...car
      }
    })
  }

  async created(): Promise<void> {
    try {
      this.loading = true
      await carsStore.fetchAllCars()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({message: 'Fehler beim Laden der Fahrzeuge. Bitte versuche es erneut.', err })
    } finally {
      this.loading = false
    }
  }

  viewCar(car: CarDto): void {
    this.$router.push({ path: `/cars/${car.id}` })
  }

  onSearchTermChanged(searchTerm: string): void {
    carsStore.setSearchTerm(searchTerm)
  }
}
</script>
