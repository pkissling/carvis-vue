<template>
  <WaitingLayer v-if="loading" />
  <Page v-else
        :title="title"
  >
    <CarDetailForm :car="car"
                   @submit="updateCar"
    />
  </Page>
</template>

<script lang="ts">
import Page from '@/components/pages/Page.vue'
import CarDetailForm from '@/components/CarDetailForm.vue'
import WaitingLayer from '@/components/WaitingLayer.vue'
import router from '@/router'
import { carsStore, notificationsStore, userStore } from '@/store'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { NavigationGuardNext, Route } from 'vue-router'

@Component({
    async beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext<CarDetailPage>): Promise<void> {
    next(async vm => {
      vm.loading = true
      const carId = to.params.carId
      try {
        vm.car = await carsStore.fetchCar(carId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch(err: any) {
        notificationsStore.error({
          message: 'Fehler beim Laden des Fahrzeugs. Bitte versuche es erneut.',
          err
        })
        // this.$router is not available
        router.push({ name: 'NotFound' })
      } finally {
        vm.loading = false
      }
    })
  },
  components: { CarDetailForm, WaitingLayer, Page } 
})
export default class CarDetailPage extends Vue {
  @Prop({ required: true })
  carId!: string

  loading = false
  car: CarDto | null = null

  get canEdit(): boolean {
      return userStore.isAdmin || this.car?.createdBy === userStore.getUserId
  }
  get title(): string {
    return `${this.car?.brand} ${this.car?.type}`
  }

  async updateCar(car: CarDto): Promise<void> {
    try {
      await carsStore.updateCar(car)
      await this.$router.push({ path: '/cars' })
      await notificationsStore.success('Fahrzeug erfolgreich bearbeitet.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      await notificationsStore.error({
        message: 'Fehler beim Bearbeiten des fahrzeugs. Bitte versuche es erneut.',
        err})
    }
  }
}
</script>
