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
import carService from '../service/car-service'
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
      carService.createCar(car)
        .then(() => this.$router.push({ path: '/' }))
        .then(() => notificationService.success('Fahrzeug erfolgreich erstellt.'))
        .catch(() => notificationService.error('Fehler beim Erstellen des Fahrzeugs. Bitte versuche es erneut.'))
    }
  }
}
</script>
