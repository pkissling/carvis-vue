<template>
  <Page title="Fahrzeug hinzufügen">
    <CarDetailForm :car="car"
                   @submit="createCar"
    />
  </Page>
</template>

<script>
import Page from '@/pages/Page.vue'
import CarDetailForm from '@/components/CarDetailForm.vue'
import { carsStore, notificationsStore } from '@/store'

export default {
  components: {
    CarDetailForm,
    Page
  },
  data() {
    return {
      car: {}
    }
  },
  methods: {
    createCar(car) {
      carsStore
        .createCar(car)
        .then(() => this.$router.push({ path: '/cars' }))
        .then(() =>
          notificationsStore.success('Fahrzeug erfolgreich erstellt.')
        )
        .catch(err =>
          notificationsStore.error({
            message:
              'Fehler beim Erstellen des Fahrzeugs. Bitte versuche es erneut.',
            err
          })
        )
    }
  }
}
</script>
