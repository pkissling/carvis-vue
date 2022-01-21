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

<script>
import Page from '@/pages/Page.vue'
import CarDetailForm from '@/components/CarDetailForm.vue'
import WaitingLayer from '@/components/WaitingLayer.vue'
import router from '@/router'
import { carsStore, notificationsStore, userStore } from '@/store'

export default {
  components: {
    CarDetailForm,
    WaitingLayer,
    Page
  },
  props: {
    carId: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      loading: false,
      car: null
    }
  },
  computed: {
    canEdit() {
      return userStore.isAdmin || this.car?.createdBy === userStore.getUsername
    },
    title() {
      return this.canEdit ? 'Fahrzeug bearbeiten' : 'Fahrzeug anzeigen'
    }
  },
  methods: {
    updateCar(car) {
      carsStore
        .updateCar(car)
        .then(() => this.$router.push({ path: '/cars' }))
        .then(() =>
          notificationsStore.success('Fahrzeug erfolgreich bearbeitet.')
        )
        .catch(err =>
          notificationsStore.error({
            message:
              'Fehler beim Bearbeiten des Fahrzeugs. Bitte versuche es erneut.',
            err
          })
        )
    }
  },
  async beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.loading = true
      const carId = to.params.carId
      carsStore
        .fetchCar(carId)
        .then(() => carsStore.cars.find(c => c.id === carId))
        .then(car => (vm.car = car))
        .catch(err => {
          notificationsStore.error({
            message:
              'Fehler beim Laden des Fahrzeugs. Bitte versuche es erneut.',
            err
          })
          // this.$router is not available
          router.push({ name: 'NotFound' })
        })
        .finally(() => (vm.loading = false))
    })
  }
}
</script>
