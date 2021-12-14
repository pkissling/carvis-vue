<template>
  <WaitingLayer v-if="loading" />
  <Page
    v-else
    :title="title"
  >
    <CarDetailForm
      :car="car"
      @submit="updateCar"
    />
  </Page>
</template>

<script>
import Page from '@/pages/Page.vue'
import notificationService from '@/service/notification-service'
import CarDetailForm from '@/components/CarDetailForm.vue'
import WaitingLayer from '@/components/WaitingLayer.vue'
import userService from '@/service/user-service'
import router from '@/router'
import store from '@/store'

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
    canEdit () {
      return userService.isAdmin() || this.car?.createdBy === userService.getUsername()
    },
    title () {
      return this.canEdit ? 'Fahrzeug bearbeiten' : 'Fahrzeug anzeigen'
    }
  },
  methods: {
    updateCar (car) {
      this.$store.dispatch('cars/updateCar', car)
        .then(() => this.$router.push({ path: '/cars' }))
        .then(() => notificationService.success('Fahrzeug erfolgreich bearbeitet.'))
        .catch(err => notificationService.error('Fehler beim Bearbeiten des Fahrzeugs. Bitte versuche es erneut.', err))
    }
  },
  async beforeRouteEnter (to, from, next) {
     next(vm => {
      vm.loading = true
      const carId = to.params.carId
      store.dispatch('cars/fetchCar', carId)
        .then(() => store.getters['cars/oneCar'](carId))
        .then(car => vm.car = car)
        .catch(err => {
          notificationService.error('Fehler beim Laden des Fahrzeugs. Bitte versuche es erneut.', err)
          // this.$router is not available
          router.push({ name: 'NotFound' })
        })
        .finally(() => vm.loading = false)
    })
  }
}
</script>
