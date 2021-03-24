<template>
  <v-container>
    <span class="text-h2">{{ title }}</span>
    <CarDetailForm
      :car="this.car"
      @submit="updateCar"
    />
  </v-container>
</template>

<script>
import GetCar from '../apollo/queries/GetCar'
import CarDetailForm from '../components/CarDetailForm'
import carService from '../service/car-service'

export default {
  components: {
    CarDetailForm
  },
  props: [
    'carId'
  ],
  apollo: {
    car: {
      query: () => GetCar,
      update: data => data.getCar,
      variables () {
        return {
          id: this.carId,
        }
      },
      prefetch: true
    }
  },
  methods: {
    updateCar (car) {
      carService.updateCar(car)
        .then(() => this.$router.push({ path: '/' }))
    }
  },
  computed: {
    canEdit () {
      return this.car && this.car.ownerUsername === this.$auth.user.sub
    },
    title () {
      return this.canEdit ? 'Fahrzeug bearbeiten' : 'Fahrzeug anzeigen'
    }
  }
}
</script>
