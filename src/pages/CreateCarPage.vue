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
import CarDetailForm from '../components/CarDetailForm'
import carService from '../service/car-service'

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
        .then(() => this.$store.dispatch('notifications/success', 'Fahrzeug erfolgreich hinzugefügt.'))
        .catch(e => this.$store.dispatch('notifications/error', 'Fehler' + e)) // TODO
    }
  }
}
</script>
