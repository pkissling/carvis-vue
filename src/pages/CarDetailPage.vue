<template>
  <v-container>
    <span class="text-h2">{{ title }}</span>
    <CarDetailForm
      :car="car"
      @submit="updateCar"
    />
  </v-container>
</template>

<script>
import GetCar from '../apollo/queries/GetCar'
import CarDetailForm from '../components/CarDetailForm'
import carService from '../service/car-service'
import userService from '../service/user-service'
import router from '../router'

export default {
  components: {
    CarDetailForm
  },
  props: {
    carId: {
      type: String,
      default: null
    }
  },
  apollo: {
    car: {
      query: () => GetCar,
      update: data => {
        const car = data.getCar
        if (car) {
          return car
        } else {
          router.push({ name: 'NotFound' })
        }
      },
      variables () {
        return {
          id: this.carId,
        }
      },
      prefetch: true
    }
  },
  computed: {
    canEdit () {
      return this.car && this.car.ownerUsername === userService.getUsername()
    },
    title () {
      return this.canEdit ? 'Fahrzeug bearbeiten' : 'Fahrzeug anzeigen'
    }
  },
  methods: {
    updateCar (car) {
      carService.updateCar(car)
        .then(() => this.$router.push({ path: '/' }))
    }
  }
}
</script>
