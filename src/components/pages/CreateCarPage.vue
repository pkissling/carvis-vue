<template>
  <Page title="Fahrzeug hinzufügen">
    <CarDetailForm
      :car="car"
      :save-car-function="createCar"
      :can-edit="true"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/components/pages/Page.vue'
import CarDetailForm from '@/components/CarDetailForm.vue'
import { carsStore, notificationsStore } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({ components: { CarDetailForm, Page }})
export default class CreateCarPage extends Vue {
  car = {} as CarDto

  async createCar(car: CarDto): Promise<void> {
    try {
      await carsStore.createCar(car)
      await this.$router.push({ path: '/cars' })
      await notificationsStore.success('Fahrzeug erfolgreich erstellt.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(err: any) {
      await notificationsStore.error({ message: 'Fehler beim Erstellen des Fahrzeugs. Bitte versuche es erneut.', err })
    }
  }
}
</script>
