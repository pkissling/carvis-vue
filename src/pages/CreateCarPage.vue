<template>
  <v-container>
    <span class="text-h2">Fahrzeug hinzufügen</span>
    <CarDetailForm
      :car="car"
      @submit="createCar"
    />
  </v-container>
</template>

<script>
import CarDetailForm from '../components/CarDetailForm.vue'
import notificationService from '../service/notification-service'

export default {
  components: {
    CarDetailForm
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
