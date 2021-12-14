<template>
  <Page title="Fahrzeug hinzufügen">
    <CarDetailForm
      :car="car"
      @submit="createCar"
    />
  </Page>
</template>

<script>
import Page from '@/pages/Page.vue'
import CarDetailForm from '@/components/CarDetailForm.vue'
import notificationService from '@/service/notification-service'

export default {
  components: {
    CarDetailForm,
    Page
  },
  data () {
    return {
      car: {}
    }
  },
  methods: {
    createCar(car) {
      this.$store.dispatch('cars/createCar', car)
        .then(() => this.$router.push({ path: '/cars' }))
        .then(() => notificationService.success('Fahrzeug erfolgreich erstellt.'))
        .catch(err => notificationService.error('Fehler beim Erstellen des Fahrzeugs. Bitte versuche es erneut.', err))
    }
  }
}
</script>
